import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { CopilotClient } from "@github/copilot-sdk";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Get ordinal suffix for a day number (1st, 2nd, 3rd, etc.)
 */
function getOrdinalSuffix(day: number): string {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
        case 1:
            return "st";
        case 2:
            return "nd";
        case 3:
            return "rd";
        default:
            return "th";
    }
}

/**
 * Format date as human-readable ordinal (e.g., "29th January 2026")
 */
function formatPublishedDate(date: Date): string {
    const day = date.getDate();
    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day}${getOrdinalSuffix(day)} ${month} ${year}`;
}

/**
 * Find the draft markdown file in the project root (excluding README.md)
 */
function findDraftArticle(rootDir: string): string | null {
    const files = fs.readdirSync(rootDir);
    for (const file of files) {
        if (file.endsWith(".md") && file.toLowerCase() !== "readme.md") {
            const fullPath = path.join(rootDir, file);
            const stat = fs.statSync(fullPath);
            if (stat.isFile()) {
                return fullPath;
            }
        }
    }
    return null;
}

/**
 * Find recent blog articles for context (excluding index.md files)
 */
function findExampleArticles(contentDir: string, count: number = 2): string[] {
    const articles: { path: string; mtime: Date }[] = [];

    function walk(dir: string) {
        const files = fs.readdirSync(dir);
        for (const file of files) {
            const fullPath = path.join(dir, file);
            const stat = fs.statSync(fullPath);
            if (stat.isDirectory()) {
                walk(fullPath);
            } else if (file.endsWith(".md") && !file.toLowerCase().startsWith("index")) {
                articles.push({ path: fullPath, mtime: stat.mtime });
            }
        }
    }

    walk(contentDir);

    // Sort by modification time (newest first) and take the first `count`
    articles.sort((a, b) => b.mtime.getTime() - a.mtime.getTime());
    return articles.slice(0, count).map((a) => a.path);
}

/**
 * Build the conversion prompt with all context
 */
function buildConversionPrompt(today: Date): string {
    const dateStr = formatPublishedDate(today);
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `You are a professional blog article converter. Your task is to convert a draft Markdown article into a fully structured blog article that matches the format and conventions of the example articles provided.

## ATTACHED FILES
I have attached the following files for context:
1. **Draft Article** - The markdown file to convert (the .md file from the project root)
2. **Example Articles** - Reference articles showing the expected format and structure
3. **TagPills.vue** - Vue component containing all available article tags. Extract the tags from the template conditionals (e.g., tag == 'Vue.js') and the tagDetails array. Choose exactly 3 tags from these available tags.

## TODAY'S DATE INFORMATION
- Published date format: "${dateStr}"
- Year: ${year}
- Month: ${month}
- Day: ${day}
- Target folder structure: content/${year}/${month}/${day}/

## CONVERSION RULES

### 1. File Structure
- Generate a slug from the article title:
  - Lowercase only
  - Words separated by hyphens
  - No special characters
  - Example: "How to Build APIs" becomes "how-to-build-apis"

### 2. Frontmatter (YAML at top of file)
Generate frontmatter with these exact fields:
- title: The article title (wrap in quotes if it contains a colon)
- description: A compelling SEO description (2-3 sentences)
- image: The first/main Cloudinary image URL with w_1200 modifier
- keywords: Array of 15-25 relevant SEO keywords
- type: page
- blog: post
- published: "${dateStr}"
- readTime: Estimated reading time in minutes (number only)
- author: Aleksandar Trpkovski
- articleTags: Array of exactly 3 tags from the available tags list

### 3. Article Header Structure
After frontmatter, include:
1. H1 heading with the title
2. Metadata line: _{{$document.published}} * {{$document.readTime}} min read - by **[{{$document.author}}](/)**_
3. Tag pills component: ::tag-pills{:tags="articleTags"}
   ::

### 4. Images
- Apply Cloudinary modifiers to all image URLs:
  - Featured/OG image in frontmatter: q_auto,f_auto,w_1200,e_sharpen:100
  - Inline images in article body: q_auto,f_auto,w_750,e_sharpen:100 (or w_850)
- Keep the original Cloudinary base URL, just ensure modifiers are correct

### 5. Links
- External links MUST use: <a href="URL" target="_blank" rel="noopener noreferrer">text</a>
- Internal section links should use NuxtLink if needed

### 6. Components
- DO NOT add ::audio-player component
- Use ::tag-pills{:tags="articleTags"} after the metadata line
- Match component syntax exactly as shown in examples

### 7. Content Integrity
- Preserve all headings, code blocks, and technical content exactly
- Fix minor Markdown formatting issues for consistency
- DO NOT rewrite, summarize, or expand content

## REQUIRED OUTPUT FORMAT

You MUST respond with a JSON object containing exactly these two fields:
1. "slug": The generated slug for the filename (without .md extension)
2. "content": The complete converted Markdown article content (including frontmatter)

Example response format:
{
  "slug": "my-article-slug",
  "content": "---\\ntitle: My Article\\n...rest of the article..."
}

IMPORTANT: Output ONLY the JSON object, no additional text or explanation.`;
}

/**
 * Parse the Copilot response to extract slug and content
 */
function parseResponse(response: string): { slug: string; content: string } | null {
    try {
        // Try to extract JSON from the response
        const jsonMatch = response.match(/\{[\s\S]*"slug"[\s\S]*"content"[\s\S]*\}/);
        if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            if (parsed.slug && parsed.content) {
                return { slug: parsed.slug, content: parsed.content };
            }
        }

        // Try parsing the entire response as JSON
        const parsed = JSON.parse(response);
        if (parsed.slug && parsed.content) {
            return { slug: parsed.slug, content: parsed.content };
        }
    } catch (e) {
        console.error("Failed to parse JSON response:", e);
    }
    return null;
}

/**
 * Create the index.md placeholder files for the date hierarchy
 */
function createIndexFiles(contentDir: string, year: string, month: string, day: string) {
    const yearDir = path.join(contentDir, year);
    const monthDir = path.join(yearDir, month);
    const dayDir = path.join(monthDir, day);

    // Content for index.md files (matches existing pattern in the blog)
    const indexContent = "::Error404\n::\n";

    // Create directories
    if (!fs.existsSync(yearDir)) {
        fs.mkdirSync(yearDir, { recursive: true });
    }
    if (!fs.existsSync(monthDir)) {
        fs.mkdirSync(monthDir, { recursive: true });
    }
    if (!fs.existsSync(dayDir)) {
        fs.mkdirSync(dayDir, { recursive: true });
    }

    // Create index.md files if they don't exist
    const yearIndex = path.join(yearDir, "index.md");
    const monthIndex = path.join(monthDir, "index.md");
    const dayIndex = path.join(dayDir, "index.md");

    if (!fs.existsSync(yearIndex)) {
        fs.writeFileSync(yearIndex, indexContent);
    }
    if (!fs.existsSync(monthIndex)) {
        fs.writeFileSync(monthIndex, indexContent);
    }
    if (!fs.existsSync(dayIndex)) {
        fs.writeFileSync(dayIndex, indexContent);
    }
}

/**
 * Main conversion function
 */
async function main() {
    const rootDir = path.resolve(__dirname, "..");
    const contentDir = path.join(rootDir, "content");

    console.log("Starting Article Conversion with Copilot SDK");
    console.log(`Root directory: ${rootDir}`);
    console.log(`Content directory: ${contentDir}`);

    // Step 1: Find the draft article
    console.log("\nStep 1: Finding draft article in root...");
    const draftPath = findDraftArticle(rootDir);

    if (!draftPath) {
        console.log("No draft article found in root directory (excluding README.md).");
        console.log("Nothing to convert. Exiting.");
        process.exit(0);
    }

    console.log(`Found draft article: ${draftPath}`);

    // Step 2: Find example articles for context
    console.log("\nStep 2: Finding example articles for context...");
    const exampleArticles = findExampleArticles(contentDir, 2);
    console.log(`Found ${exampleArticles.length} example articles:`);
    exampleArticles.forEach((a) => console.log(`  - ${path.relative(rootDir, a)}`));

    // Step 3: Locate TagPills component for available tags
    console.log("\nStep 3: Locating TagPills component...");
    const tagPillsPath = path.join(rootDir, "app", "components", "TagPills.vue");
    if (!fs.existsSync(tagPillsPath)) {
        console.error(`TagPills component not found: ${tagPillsPath}`);
        process.exit(1);
    }
    console.log(`Found TagPills component: ${tagPillsPath}`);

    // Step 4: Build file attachments
    console.log("\nStep 4: Preparing file attachments...");
    const attachments = [
        { type: "file" as const, path: draftPath, displayName: "draft-article.md" },
        { type: "file" as const, path: tagPillsPath, displayName: "TagPills.vue" },
        ...exampleArticles.map((articlePath, index) => ({
            type: "file" as const,
            path: articlePath,
            displayName: `example-article-${index + 1}.md`,
        })),
    ];
    console.log(`Prepared ${attachments.length} file attachments`);

    // Step 5: Build the prompt
    console.log("\nStep 5: Building conversion prompt...");
    const today = new Date();
    const prompt = buildConversionPrompt(today);

    // Step 6: Initialize Copilot and send the prompt
    console.log("\nStep 6: Initializing Copilot SDK...");
    const client = new CopilotClient();

    try {
        await client.start();
        console.log("Copilot client started successfully.");

        const session = await client.createSession({
            model: "claude-opus-4.5",
        });
        console.log("Session created with model: claude-opus-4.5");

        console.log("\nStep 7: Sending prompt to Copilot with file attachments (this may take a moment)...");
        const result = await session.sendAndWait(
            {
                prompt,
                attachments,
            },
            300000 // 5 minutes timeout for complex conversion
        );

        // Extract the text response from the result
        if (!result || !result.data || !result.data.content) {
            throw new Error("No response received from Copilot");
        }

        const responseText = result.data.content;

        console.log("\nStep 8: Parsing Copilot response...");
        const parsed = parseResponse(responseText);

        if (!parsed) {
            console.error("Failed to parse Copilot response. Raw response:");
            console.error(responseText.substring(0, 500) + "...");
            throw new Error("Invalid response format from Copilot");
        }

        const { slug, content } = parsed;
        console.log(`Generated slug: ${slug}`);

        // Step 9: Create the article file
        console.log("\nStep 9: Creating article file...");
        const year = String(today.getFullYear());
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");

        // Create index files for the date hierarchy
        createIndexFiles(contentDir, year, month, day);

        const targetDir = path.join(contentDir, year, month, day);
        const targetFile = path.join(targetDir, `${slug}.md`);

        fs.writeFileSync(targetFile, content, "utf-8");
        console.log(`Article created: ${targetFile}`);

        // Step 10: Delete the original draft
        console.log("\nStep 10: Cleaning up...");
        fs.unlinkSync(draftPath);
        console.log(`Deleted original draft: ${draftPath}`);

        // Cleanup
        await session.destroy();
        await client.stop();

        console.log("\nConversion completed successfully!");
        console.log(`New article: content/${year}/${month}/${day}/${slug}.md`);
        process.exit(0);
    } catch (error) {
        console.error("Error during conversion:", error);
        await client.stop();
        process.exit(1);
    }
}

main().catch((error) => {
    console.error("Unhandled error:", error);
    process.exit(1);
});
