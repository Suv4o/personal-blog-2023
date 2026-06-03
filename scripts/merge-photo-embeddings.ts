import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = path.resolve(__dirname, "..");
const TEXT_JSON = path.join(ROOT, "server", "utils", "photo-text-embeddings.json");
const IMAGE_JSON = path.join(ROOT, "server", "utils", "photo-image-embeddings.json");
const OUTPUT = path.join(ROOT, "server", "utils", "photo-embeddings.json");

interface TextEntry {
    photoPath: string;
    imagePath: string;
    textEmbedding: number[];
}

interface ImageEntry {
    photoPath: string;
    imageEmbedding: number[];
}

interface MergedEntry {
    photoPath: string;
    imagePath: string;
    textEmbedding: number[];
    imageEmbedding: number[];
}

function readJson<T>(file: string): T {
    if (!fs.existsSync(file)) {
        console.error(`Missing input file: ${file}`);
        process.exit(1);
    }
    return JSON.parse(fs.readFileSync(file, "utf-8")) as T;
}

function main() {
    const textEntries = readJson<TextEntry[]>(TEXT_JSON);
    const imageEntries = readJson<ImageEntry[]>(IMAGE_JSON);

    const imageMap = new Map<string, number[]>();
    for (const e of imageEntries) imageMap.set(e.photoPath, e.imageEmbedding);

    const merged: MergedEntry[] = [];
    const missingImage: string[] = [];

    for (const t of textEntries) {
        const imageEmbedding = imageMap.get(t.photoPath);
        if (!imageEmbedding) {
            missingImage.push(t.photoPath);
            continue;
        }
        merged.push({
            photoPath: t.photoPath,
            imagePath: t.imagePath,
            textEmbedding: t.textEmbedding,
            imageEmbedding,
        });
    }

    const textPaths = new Set(textEntries.map((t) => t.photoPath));
    const missingText = imageEntries.map((i) => i.photoPath).filter((p) => !textPaths.has(p));

    fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
    fs.writeFileSync(OUTPUT, JSON.stringify(merged, null, 2));

    console.log(`Merged ${merged.length} photo embeddings → ${OUTPUT}`);
    if (missingImage.length) {
        console.warn(`\n⚠️  ${missingImage.length} photos missing image embedding:`);
        for (const p of missingImage) console.warn(`  - ${p}`);
    }
    if (missingText.length) {
        console.warn(`\n⚠️  ${missingText.length} image embeddings have no matching text entry:`);
        for (const p of missingText) console.warn(`  - ${p}`);
    }

    fs.unlinkSync(TEXT_JSON);
    fs.unlinkSync(IMAGE_JSON);
    console.log("\nCleaned up intermediate files.");
}

main();
