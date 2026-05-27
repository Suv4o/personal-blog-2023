import fs from "fs";
import path from "path";
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface TranscriptSegment {
    start: number;
    end: number;
    text: string;
}

function resolveTarget(input: string): { dir: string; jsonFile: string; mp3File: string } {
    const abs = path.isAbsolute(input) ? input : path.resolve(process.cwd(), input);
    const stat = fs.existsSync(abs) ? fs.statSync(abs) : null;

    let dir: string;
    if (stat?.isFile() && abs.endsWith(".json")) {
        dir = path.dirname(abs);
    } else {
        dir = abs;
    }

    const jsonFile = path.join(dir, "summary.json");
    const mp3File = path.join(dir, "summary.mp3");
    return { dir, jsonFile, mp3File };
}

async function generateAudio(text: string): Promise<Buffer> {
    const response = await client.audio.speech.create({
        model: "tts-1-hd",
        voice: "alloy",
        input: text,
    });
    return Buffer.from(await response.arrayBuffer());
}

async function main() {
    const arg = process.argv[2];
    if (!arg) {
        console.error("Usage: yarn regenerate-audio <path-to-summary-dir-or-json>");
        console.error("Example: yarn regenerate-audio ../audio-summary/2026/05/27/what-openclip-did-to-my-photo-library");
        process.exit(1);
    }

    const { dir, jsonFile, mp3File } = resolveTarget(arg);

    if (!fs.existsSync(jsonFile)) {
        console.error(`summary.json not found: ${jsonFile}`);
        process.exit(1);
    }

    console.log(`Reading transcript: ${jsonFile}`);
    const segments: TranscriptSegment[] = JSON.parse(fs.readFileSync(jsonFile, "utf-8"));

    if (!Array.isArray(segments) || segments.length === 0) {
        console.error("summary.json is empty or not an array of segments.");
        process.exit(1);
    }

    const text = segments
        .map((s) => s.text.trim())
        .filter(Boolean)
        .join(" ");

    console.log(`Text to speak (${text.length} chars):`);
    console.log(text);

    if (fs.existsSync(mp3File)) {
        const backup = mp3File + ".bak";
        fs.copyFileSync(mp3File, backup);
        console.log(`Backed up existing audio to: ${backup}`);
    }

    console.log("Generating audio with TTS...");
    const audio = await generateAudio(text);

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(mp3File, audio);
    console.log(`Saved: ${mp3File}`);
    console.log("Done. (summary.json was not modified.)");
}

main().catch((error) => {
    console.error("Error:", error);
    process.exit(1);
});
