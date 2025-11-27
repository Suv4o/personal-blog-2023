import fs from "fs";
import path from "path";
import OpenAI from "openai";
import { Agent, run, extractAllTextOutput } from "@openai/agents";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Script structure returned by agents (single speaker summary)
 */
interface PodcastScriptSingle {
    intro: string;
    content: string;
    outro: string;
}

/**
 * 1️⃣ Scriptwriter Agent - Single Speaker Summary
 * Turns a Markdown article into a concise audio summary
 */
const scriptwriterSingle = new Agent({
    name: "ScriptwriterSingle",
    instructions: `
    You are a helpful assistant that creates short audio summaries for blog articles.
    Convert a markdown blog article into a concise summary script for a single speaker.
    The goal is to give the listener a quick overview of what the blog post is about, so they can decide if they want to read it.

    CRITICAL INSTRUCTIONS:
    - **Intro**: Make it human and natural. Use varied openers like:
      - "In this article, you will learn..."
      - "This post demonstrates how to..."
      - "Here, we explore..."
      - "This article gives you an idea about..."
    - **Content**: The core summary should be MAXIMUM 30 SECONDS (approx. 60-75 words).
      - DO NOT read the title.
      - Focus on the value: what problem does it solve?
    - **Outro**: End with a call to action like: "If you are interested, read more below." or "Check out the full article for details."
    - **Tone**: Friendly, professional, and inviting.
    - DO NOT read code out loud.
    
    Format the output as JSON with this structure:

    {
      "intro": "string",
      "content": "string",
      "outro": "string"
    }
  `,
    model: "gpt-4o",
});

/**
 * 2️⃣ Editor Agent
 * Polishes phrasing
 */
const editorSingle = new Agent({
    name: "EditorSingle",
    instructions: `
    You are a professional editor.
    Take the raw summary script and make it flow smoothly.
    Ensure the **content** part is under 30 seconds.
    Ensure the intro and outro sound natural and human, not robotic.
    Return only valid JSON with the same structure as you received.
  `,
    model: "gpt-4o",
});

/**
 * 3️⃣ TTS Agent
 * Converts the final script into audio
 */
async function generateVoiceLine(text: string): Promise<Buffer> {
    const response = await client.audio.speech.create({
        model: "tts-1-hd",
        voice: "alloy",
        input: text,
    });
    return Buffer.from(await response.arrayBuffer());
}

/**
 * Generate transcript with timestamps using Whisper API
 */
async function generateTranscript(audioFile: string) {
    try {
        console.log(`  🎙️  Transcribing ${path.basename(audioFile)}...`);

        // Call Whisper API with verbose JSON format to get timestamps
        const transcription = await client.audio.transcriptions.create({
            file: fs.createReadStream(audioFile),
            model: "whisper-1",
            response_format: "verbose_json",
            timestamp_granularities: ["segment"],
        });

        // Format the transcript as a clean array with start, end, and text
        const transcript =
            (transcription as any).segments?.map((segment: any) => ({
                start: segment.start,
                end: segment.end,
                text: segment.text.trim(),
            })) || [];

        // Generate output filename (summary.json)
        const transcriptFileName = audioFile.replace(/\.(mp3|wav|m4a)$/i, ".json");

        // Save as JSON
        fs.writeFileSync(transcriptFileName, JSON.stringify(transcript, null, 2));

        console.log(`  ✅ Transcript saved to ${transcriptFileName}`);
        // console.log(`📊 Total segments: ${transcript.length}`);

        return transcript;
    } catch (error) {
        console.error("  ❌ Failed to generate transcript:", error instanceof Error ? error.message : error);
        // Don't throw, just log error so we don't stop the whole process
    }
}

/**
 * Generate Summary for a single file
 */
async function generateSummaryForFile(filePath: string, outputDir: string) {
    console.log(`\n📄 Processing: ${filePath}`);

    const markdown = fs.readFileSync(filePath, "utf-8");

    // Step 1: Generate Script
    console.log("  Writing summary script...");
    const draftResult = await run(scriptwriterSingle, `Create a summary for this article:\n\n${markdown}`);
    const draftText = extractAllTextOutput(draftResult.newItems);

    console.log("  Editing script...");
    const finalResult = await run(editorSingle, `Polish this summary script:\n\n${draftText}`);
    let scriptText = extractAllTextOutput(finalResult.newItems);

    // Try to extract JSON if it's wrapped in markdown code blocks
    const jsonMatch = scriptText.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
    if (jsonMatch) {
        scriptText = jsonMatch[1];
    }

    let script: PodcastScriptSingle;
    try {
        script = JSON.parse(scriptText);
    } catch (e) {
        console.error("  ❌ Failed to parse JSON script. Skipping file.");
        return;
    }

    // Step 2: Generate Audio
    console.log("  🎙️ Generating audio...");
    const chunks: Buffer[] = [];
    chunks.push(await generateVoiceLine(script.intro));
    chunks.push(await generateVoiceLine(script.content));
    chunks.push(await generateVoiceLine(script.outro));

    const combined = Buffer.concat(chunks);

    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputFile = path.join(outputDir, "summary.mp3");
    fs.writeFileSync(outputFile, combined);
    console.log(`  ✅ Saved audio to: ${outputFile}`);

    // Step 3: Generate Transcript
    await generateTranscript(outputFile);
}

/**
 * Recursively find all blog posts and process them
 */
async function processAllBlogPosts(contentDir: string, outputBaseDir: string) {
    let processedCount = 0;
    const LIMIT = process.env.LIMIT ? parseInt(process.env.LIMIT) : Infinity;

    // Helper to walk directories
    async function walk(dir: string) {
        if (processedCount >= LIMIT) return;

        const files = fs.readdirSync(dir);

        for (const file of files) {
            if (processedCount >= LIMIT) return;

            const fullPath = path.join(dir, file);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory()) {
                await walk(fullPath);
            } else if (file.endsWith(".md") && !file.toLowerCase().startsWith("index")) {
                // It's a blog post!
                // Expected path structure: .../content/[year]/[month]/[day]/[slug].md

                // We need to extract the relative path from contentDir to build the output path
                const relativePath = path.relative(contentDir, fullPath);
                const pathParts = relativePath.split(path.sep);

                // Check if we have enough parts for year/month/day/slug.md
                // pathParts might be like ['2023', '03', '19', 'slug.md']
                if (pathParts.length >= 4) {
                    const slug = path.basename(file, ".md");
                    // Construct output path: outputBaseDir/[year]/[month]/[day]/[slug]/
                    // We take the directory parts (year/month/day) and add the slug as a folder
                    const dirParts = pathParts.slice(0, -1); // Remove filename
                    const targetDir = path.join(outputBaseDir, ...dirParts, slug);
                    const targetFile = path.join(targetDir, "summary.mp3");
                    const transcriptFile = path.join(targetDir, "summary.json");

                    const audioExists = fs.existsSync(targetFile);
                    const transcriptExists = fs.existsSync(transcriptFile);

                    if (audioExists && transcriptExists) {
                        console.log(`  ⏭️  Skipping (all exist): ${targetFile}`);
                        continue;
                    }

                    if (audioExists && !transcriptExists) {
                        console.log(`  ⚠️ Audio exists but transcript missing. Generating transcript only...`);
                        await generateTranscript(targetFile);
                        processedCount++; // Count this as work done
                        continue;
                    }

                    // If audio doesn't exist, generate everything
                    await generateSummaryForFile(fullPath, targetDir);
                    processedCount++;
                } else {
                    console.log(`  ⚠️ Skipping file with unexpected structure: ${relativePath}`);
                }
            }
        }
    }

    await walk(contentDir);
}

import { fileURLToPath } from "url";

/**
 * Main
 */
async function main() {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const contentDir = path.resolve(__dirname, "../content");
    const outputBaseDir = path.resolve(__dirname, "../audio-summary");

    console.log(`🚀 Starting Audio Summary Automation`);
    console.log(`📂 Content Directory: ${contentDir}`);
    console.log(`📂 Output Directory: ${outputBaseDir}`);

    if (!fs.existsSync(contentDir)) {
        console.error(`❌ Content directory not found: ${contentDir}`);
        process.exit(1);
    }

    await processAllBlogPosts(contentDir, outputBaseDir);
    console.log("\n✨ All done!");
}

main().catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
});
