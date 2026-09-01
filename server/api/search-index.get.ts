import { promises as fs } from "fs";
import { join } from "path";

interface ContentEntry {
    id: string;
    kind: string;
    title: string;
    description: string;
    path: string;
    image?: string;
    textEmbedding: number[];
}

interface VisualEntry {
    id: string;
    kind: string;
    path: string;
    imagePath: string;
    imageEmbedding: number[];
}

interface IndexDoc<T> {
    _meta: { model: string; dim: number; count: number };
    entries: T[];
}

let cached: {
    contentEmbeddings: ContentEntry[];
    visualEmbeddings: VisualEntry[];
    _meta: { text: IndexDoc<ContentEntry>["_meta"]; visual: IndexDoc<VisualEntry>["_meta"] };
} | null = null;

export default defineEventHandler(async (event) => {
    setHeader(event, "Cache-Control", "public, max-age=31536000, immutable");
    if (cached) return cached;

    const root = process.cwd();
    const contentPath = join(root, "server/utils/content-embeddings.json");
    const visualPath = join(root, "server/utils/visual-embeddings.json");

    const [contentRaw, visualRaw] = await Promise.all([fs.readFile(contentPath, "utf-8"), fs.readFile(visualPath, "utf-8")]);
    const contentDoc = JSON.parse(contentRaw) as IndexDoc<ContentEntry>;
    const visualDoc = JSON.parse(visualRaw) as IndexDoc<VisualEntry>;

    cached = {
        contentEmbeddings: contentDoc.entries,
        visualEmbeddings: visualDoc.entries,
        _meta: { text: contentDoc._meta, visual: visualDoc._meta },
    };
    return cached;
});
