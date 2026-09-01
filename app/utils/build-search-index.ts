import fs from "fs";
import path from "path";
import { pipeline, RawImage } from "@huggingface/transformers";

const TEXT_MODEL = "Xenova/all-MiniLM-L6-v2";
const TEXT_DIM = 384;
const CLIP_MODEL = "Xenova/clip-vit-base-patch32";
const CLIP_DIM = 512;

export type Kind = "article" | "photo" | "keyboard" | "page";

export interface ContentEmbedding {
    id: string;
    kind: Kind;
    title: string;
    description: string;
    path: string;
    image?: string;
    keywordHaystack: string;
    textEmbedding: number[];
}

export interface VisualEmbedding {
    id: string;
    kind: "photo" | "keyboard";
    path: string;
    imagePath: string;
    imageEmbedding: number[];
}

export interface SearchIndexDoc<T> {
    _meta: { model: string; dim: number; count: number };
    entries: T[];
}

interface ParsedFile {
    raw: string;
    frontmatter: string;
    body: string;
    title?: string;
    description?: string;
    type?: string;
    primaryImage?: string;
    extraImages: string[];
    keywords: string[];
}

const FRONTMATTER_RE = /^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n?/;

function parseFile(raw: string): ParsedFile {
    const m = raw.match(FRONTMATTER_RE);
    const frontmatter = m ? m[1]! : "";
    const body = m ? raw.slice(m[0].length) : raw;
    const result: ParsedFile = { raw, frontmatter, body, extraImages: [], keywords: [] };

    if (frontmatter) {
        result.title = scalarOf(frontmatter, "title");
        result.description = scalarOf(frontmatter, "description");
        result.type = scalarOf(frontmatter, "type");
        result.primaryImage = scalarOf(frontmatter, "image");
        result.extraImages = extraImageFields(frontmatter);
        result.keywords = extractKeywords(frontmatter);
    }
    return result;
}

function extractKeywords(frontmatter: string): string[] {
    const m = frontmatter.match(/^keywords\s*:\s*\r?\n((?:\s+-\s+.+\r?\n?)+)/m);
    if (!m) return [];
    return m[1]!
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter((l) => l.startsWith("- "))
        .map((l) => l.slice(2).trim().replace(/^["']|["']$/g, ""))
        .filter(Boolean);
}

function buildKeywordHaystack(parsed: ParsedFile): string {
    const parts: string[] = [];
    if (parsed.title) parts.push(parsed.title);
    if (parsed.description) parts.push(parsed.description);
    if (parsed.keywords.length) parts.push(parsed.keywords.join(", "));
    const bodyExcerpt = parsed.body.replace(/\s+/g, " ").slice(0, 500);
    if (bodyExcerpt) parts.push(bodyExcerpt);
    return parts.join("\n").toLowerCase();
}

function scalarOf(frontmatter: string, key: string): string | undefined {
    const re = new RegExp(`^${escapeRe(key)}\\s*:\\s*(.*?)\\s*$`, "m");
    const m = frontmatter.match(re);
    if (!m) return undefined;
    let v = m[1]!.trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
        v = v.slice(1, -1);
    }
    if (!v || v.startsWith("|") || v.startsWith(">")) return undefined;
    return v;
}

function extraImageFields(frontmatter: string): string[] {
    const out: string[] = [];
    const re = /^([A-Za-z][A-Za-z0-9_]*Image)\s*:\s*(.+?)\s*$/gm;
    let m: RegExpExecArray | null;
    while ((m = re.exec(frontmatter)) !== null) {
        let v = m[2]!.trim();
        if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
            v = v.slice(1, -1);
        }
        if (v && !v.startsWith("|") && !v.startsWith(">")) {
            out.push(v);
        }
    }
    return out;
}

function escapeRe(s: string): string {
    return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function walkMd(dir: string): string[] {
    const out: string[] = [];
    if (!fs.existsSync(dir)) return out;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) out.push(...walkMd(full));
        else if (entry.isFile() && entry.name.endsWith(".md")) out.push(full);
    }
    return out;
}

function toRoutePath(contentDir: string, abs: string): string {
    const rel = path.relative(contentDir, abs).replace(/\\/g, "/").replace(/\.md$/, "");
    return "/" + rel.replace(/\/index$/, "");
}

function classify(route: string, fm: ParsedFile): Kind | null {
    if (route === "/about-me") return "page";
    if (/^\/\d{4}\/\d{2}\/\d{2}\/[\w-]+$/.test(route)) return "article";
    if (/^\/through-the-lens\/[^/]+\/[^/]+$/.test(route) && fm.type === "photo") return "photo";
    if (/^\/the-keyboard-lab\/[^/]+$/.test(route) && !route.endsWith("/index")) return "keyboard";
    return null;
}

function collectImages(parsed: ParsedFile, kind: Kind): string[] {
    if (kind === "photo") return parsed.primaryImage ? [parsed.primaryImage] : [];
    if (kind !== "keyboard") return [];
    const all: string[] = [];
    if (parsed.primaryImage) all.push(parsed.primaryImage);
    for (const img of parsed.extraImages) all.push(img);
    return Array.from(new Set(all));
}

function magnitude(v: number[]): number {
    let s = 0;
    for (const x of v) s += x * x;
    return Math.sqrt(s);
}

export interface BuildSearchIndexOptions {
    projectRoot: string;
    log?: (msg: string) => void;
}

export interface BuildSearchIndexResult {
    contentCount: number;
    visualCount: number;
    byKind: Record<string, number>;
    contentPath: string;
    visualPath: string;
}

export async function buildSearchIndex(opts: BuildSearchIndexOptions): Promise<BuildSearchIndexResult> {
    const log = opts.log ?? console.log;
    const root = opts.projectRoot;
    const contentDir = path.join(root, "content");
    const publicDir = path.join(root, "public");
    const outContent = path.join(root, "server", "utils", "content-embeddings.json");
    const outVisual = path.join(root, "server", "utils", "visual-embeddings.json");

    log(`Loading text model: ${TEXT_MODEL}`);
    const textExtractor = await pipeline("feature-extraction", TEXT_MODEL);
    log(`Loading CLIP image model: ${CLIP_MODEL}`);
    const imageExtractor = await pipeline("image-feature-extraction", CLIP_MODEL);

    const mdFiles = walkMd(contentDir);
    log(`Found ${mdFiles.length} markdown files`);

    const contentEntries: ContentEmbedding[] = [];
    const visualEntries: VisualEmbedding[] = [];

    for (const file of mdFiles) {
        const raw = fs.readFileSync(file, "utf-8");
        const parsed = parseFile(raw);
        const route = toRoutePath(contentDir, file);
        const kind = classify(route, parsed);
        if (!kind) continue;

        const textOut = await textExtractor(raw, { pooling: "mean", normalize: true });
        const textVec = (textOut.tolist() as number[][])[0]!;

        contentEntries.push({
            id: route,
            kind,
            title: parsed.title ?? "",
            description: parsed.description ?? "",
            path: route,
            image: parsed.primaryImage,
            keywordHaystack: buildKeywordHaystack(parsed),
            textEmbedding: textVec,
        });

        const imagesToEmbed = collectImages(parsed, kind);
        for (const img of imagesToEmbed) {
            try {
                const rawImg = await loadImage(publicDir, img);
                const imgOut = await imageExtractor(rawImg);
                let imgVec = (imgOut.tolist() as number[][])[0]!;
                const m = magnitude(imgVec);
                if (m > 0 && Math.abs(m - 1) > 1e-3) {
                    imgVec = imgVec.map((x) => x / m);
                }
                if (imgVec.length !== CLIP_DIM) {
                    log(`  unexpected image embedding dim ${imgVec.length} for ${img}`);
                }
                visualEntries.push({
                    id: `${route}::${img}`,
                    kind: kind === "photo" ? "photo" : "keyboard",
                    path: route,
                    imagePath: img,
                    imageEmbedding: imgVec,
                });
            } catch (e) {
                log(`  failed to embed image ${img} (${route}): ${(e as Error).message}`);
            }
        }
    }

    fs.mkdirSync(path.dirname(outContent), { recursive: true });
    const contentDoc: SearchIndexDoc<ContentEmbedding> = {
        _meta: { model: TEXT_MODEL, dim: TEXT_DIM, count: contentEntries.length },
        entries: contentEntries,
    };
    const visualDoc: SearchIndexDoc<VisualEmbedding> = {
        _meta: { model: CLIP_MODEL, dim: CLIP_DIM, count: visualEntries.length },
        entries: visualEntries,
    };
    fs.writeFileSync(outContent, JSON.stringify(contentDoc, null, 2));
    fs.writeFileSync(outVisual, JSON.stringify(visualDoc, null, 2));

    const byKind = contentEntries.reduce<Record<string, number>>((acc, e) => {
        acc[e.kind] = (acc[e.kind] ?? 0) + 1;
        return acc;
    }, {});

    return {
        contentCount: contentEntries.length,
        visualCount: visualEntries.length,
        byKind,
        contentPath: outContent,
        visualPath: outVisual,
    };
}

async function loadImage(publicDir: string, url: string): Promise<RawImage> {
    if (/^https?:\/\//.test(url)) return await RawImage.read(url);
    const localPath = path.join(publicDir, url.replace(/^\//, ""));
    return await RawImage.read(localPath);
}
