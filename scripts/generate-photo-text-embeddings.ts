import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import matter from "gray-matter";
import { pipeline } from "@huggingface/transformers";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = path.resolve(__dirname, "..");
const PHOTOS_DIR = path.join(ROOT, "content", "through-the-lens");
const OUTPUT = path.join(ROOT, "server", "utils", "photo-text-embeddings.json");

interface PhotoTextEntry {
    photoPath: string;
    imagePath: string;
    textEmbedding: number[];
}

interface PhotoFrontmatter {
    title?: string;
    location?: string;
    description?: string;
    keywords?: string[];
    image?: string;
    type?: string;
}

function walkMarkdownFiles(dir: string): string[] {
    const out: string[] = [];
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            out.push(...walkMarkdownFiles(full));
        } else if (entry.isFile() && entry.name.endsWith(".md") && entry.name !== "index.md") {
            out.push(full);
        }
    }
    return out;
}

function toPhotoPath(absMdPath: string): string {
    const rel = path.relative(path.join(ROOT, "content"), absMdPath).replace(/\\/g, "/");
    return "/" + rel.replace(/\.md$/, "");
}

function buildTextBlob(fm: PhotoFrontmatter, body: string): string {
    const parts: string[] = [];
    if (fm.title) parts.push(fm.title);
    if (fm.location) parts.push(fm.location);
    if (fm.description) parts.push(fm.description);
    if (Array.isArray(fm.keywords) && fm.keywords.length) parts.push(fm.keywords.join(", "));
    parts.push(body.trim());
    return parts.join("\n").trim();
}

async function main() {
    if (!fs.existsSync(PHOTOS_DIR)) {
        console.error(`Photos directory not found: ${PHOTOS_DIR}`);
        process.exit(1);
    }

    const mdFiles = walkMarkdownFiles(PHOTOS_DIR);
    console.log(`Found ${mdFiles.length} photo markdown files`);

    console.log("Loading Xenova/all-MiniLM-L6-v2…");
    const extractor = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");

    const entries: PhotoTextEntry[] = [];
    let skipped = 0;

    for (const file of mdFiles) {
        const raw = fs.readFileSync(file, "utf-8");
        const { data, content: body } = matter(raw);
        const fm = data as PhotoFrontmatter;

        if (fm.type !== "photo") {
            skipped++;
            continue;
        }

        if (!fm.image) {
            console.warn(`  ⚠️  Skipping (no image frontmatter): ${file}`);
            skipped++;
            continue;
        }

        const photoPath = toPhotoPath(file);
        const text = buildTextBlob(fm, body);
        const output = await extractor(text, { pooling: "mean", normalize: true });
        const vector = (output.tolist() as number[][])[0]!;

        entries.push({
            photoPath,
            imagePath: fm.image,
            textEmbedding: vector,
        });

        console.log(`  ✅ ${photoPath}`);
    }

    fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
    fs.writeFileSync(OUTPUT, JSON.stringify(entries, null, 2));
    console.log(`\nWrote ${entries.length} text embeddings (skipped ${skipped}) → ${OUTPUT}`);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
