import type { ContentEntry, SearchConsent, SearchIndexResponse, SearchResult, VisualEntry } from "~/types";
import { cosineSimilarity } from "~/utils/cosine-similarity";

const CONSENT_KEY = "semanticSearch.consent";
const ALPHA_VISUAL = 0.25;
const MIN_ABSOLUTE_SCORE = 0.25;
const RELATIVE_THRESHOLD = 0.55;
const MAX_PER_KIND = 4;
const MAX_TOTAL_RESULTS = 10;
const LEXICAL_WEIGHT = 0.4;
const MIN_TOKEN_LEN = 3;

interface ModelHandles {
    minilm: (text: string) => Promise<number[]>;
    clipText: (text: string) => Promise<number[]>;
}

let indexPromise: Promise<SearchIndexResponse> | null = null;
let modelsPromise: Promise<ModelHandles> | null = null;

async function fetchIndex(): Promise<SearchIndexResponse> {
    if (!indexPromise) {
        indexPromise = $fetch<SearchIndexResponse>("/api/search-index");
    }
    return await indexPromise;
}

function l2Normalize(v: number[]): number[] {
    let m = 0;
    for (const x of v) m += x * x;
    m = Math.sqrt(m);
    if (m === 0) return v;
    if (Math.abs(m - 1) < 1e-3) return v;
    return v.map((x) => x / m);
}

async function loadModels(onProgress?: (m: string) => void): Promise<ModelHandles> {
    if (!modelsPromise) {
        modelsPromise = (async () => {
            onProgress?.("Loading text model (all-MiniLM-L6-v2)…");
            const transformers = await import("@huggingface/transformers");
            const textExtractor = await transformers.pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");

            onProgress?.("Loading CLIP text encoder (clip-vit-base-patch32)…");
            const tokenizer = await transformers.AutoTokenizer.from_pretrained("Xenova/clip-vit-base-patch32");
            const clipTextModel = await transformers.CLIPTextModelWithProjection.from_pretrained("Xenova/clip-vit-base-patch32");

            const minilm = async (text: string) => {
                const out = await textExtractor(text, { pooling: "mean", normalize: true });
                return (out.tolist() as number[][])[0]!;
            };

            const clipText = async (text: string) => {
                const inputs = await tokenizer(text, { padding: true, truncation: true });
                const { text_embeds } = await clipTextModel(inputs);
                const raw = (text_embeds.tolist() as number[][])[0]!;
                return l2Normalize(raw);
            };

            onProgress?.("Models ready.");
            return { minilm, clipText };
        })();
    }
    return await modelsPromise;
}

function readConsent(): SearchConsent {
    if (typeof window === "undefined") return "unknown";
    const v = window.localStorage.getItem(CONSENT_KEY);
    if (v === "accepted" || v === "declined") return v;
    return "unknown";
}

function writeConsent(v: SearchConsent) {
    if (typeof window === "undefined") return;
    if (v === "unknown") window.localStorage.removeItem(CONSENT_KEY);
    else window.localStorage.setItem(CONSENT_KEY, v);
}

function lexicalScore(query: string, title: string, haystack: string): number {
    const tokens = query.toLowerCase().split(/\s+/).filter((t) => t.length >= MIN_TOKEN_LEN);
    if (tokens.length === 0) return 0;
    const t = title.toLowerCase();
    let titleHits = 0;
    let bodyHits = 0;
    for (const tok of tokens) {
        if (t.includes(tok)) titleHits++;
        if (haystack.includes(tok)) bodyHits++;
    }
    return 0.6 * (titleHits / tokens.length) + 0.4 * (bodyHits / tokens.length);
}

function filterResults(scored: SearchResult[]): SearchResult[] {
    const sorted = [...scored].sort((a, b) => b.score - a.score);
    const aboveAbsolute = sorted.filter((r) => r.score >= MIN_ABSOLUTE_SCORE);
    if (aboveAbsolute.length === 0) return [];
    const topScore = aboveAbsolute[0]!.score;
    const cutoff = topScore * RELATIVE_THRESHOLD;
    const aboveRelative = aboveAbsolute.filter((r) => r.score >= cutoff);
    const perKindCount = new Map<string, number>();
    const capped: SearchResult[] = [];
    for (const r of aboveRelative) {
        const n = perKindCount.get(r.kind) ?? 0;
        if (n >= MAX_PER_KIND) continue;
        capped.push(r);
        perKindCount.set(r.kind, n + 1);
        if (capped.length >= MAX_TOTAL_RESULTS) break;
    }
    return capped;
}

function scoreSemantic(
    query: string,
    minilmQuery: number[],
    clipQuery: number[],
    content: ContentEntry[],
    visualByPath: Map<string, VisualEntry[]>
): SearchResult[] {
    const out: SearchResult[] = [];
    for (const c of content) {
        const textSim = cosineSimilarity(minilmQuery, c.textEmbedding);
        const visuals = visualByPath.get(c.path);
        let semantic: number;
        if (visuals && visuals.length > 0) {
            let bestImage = -Infinity;
            for (const v of visuals) {
                const s = cosineSimilarity(clipQuery, v.imageEmbedding);
                if (s > bestImage) bestImage = s;
            }
            semantic = ALPHA_VISUAL * bestImage + (1 - ALPHA_VISUAL) * textSim;
        } else {
            semantic = textSim;
        }
        const lexical = lexicalScore(query, c.title, c.keywordHaystack);
        const score = (1 - LEXICAL_WEIGHT) * semantic + LEXICAL_WEIGHT * lexical;
        out.push({
            id: c.id,
            kind: c.kind,
            title: c.title,
            description: c.description,
            path: c.path,
            image: c.image,
            score,
        });
    }
    return filterResults(out);
}

function scoreKeyword(query: string, content: ContentEntry[]): SearchResult[] {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const tokens = q.split(/\s+/).filter(Boolean);
    const raw: SearchResult[] = [];
    let maxRaw = 0;
    for (const c of content) {
        const hay = c.keywordHaystack;
        let score = 0;
        for (const t of tokens) {
            const idx = hay.indexOf(t);
            if (idx === -1) {
                score = 0;
                break;
            }
            score += 1 / (1 + idx / 100);
        }
        if (score > 0) {
            if (score > maxRaw) maxRaw = score;
            raw.push({
                id: c.id,
                kind: c.kind,
                title: c.title,
                description: c.description,
                path: c.path,
                image: c.image,
                score,
            });
        }
    }
    if (maxRaw === 0) return [];
    const normalized = raw.map((r) => ({ ...r, score: r.score / maxRaw }));
    return filterResults(normalized);
}

export function useSemanticSearch() {
    return {
        consent: readConsent,
        setConsent: writeConsent,
        async searchKeyword(query: string): Promise<SearchResult[]> {
            const index = await fetchIndex();
            return scoreKeyword(query, index.contentEmbeddings);
        },
        async searchSemantic(query: string, onProgress?: (m: string) => void): Promise<SearchResult[]> {
            const [index, models] = await Promise.all([fetchIndex(), loadModels(onProgress)]);
            onProgress?.("Embedding query…");
            const [minilmVec, clipVec] = await Promise.all([models.minilm(query), models.clipText(query)]);
            const visualByPath = new Map<string, VisualEntry[]>();
            for (const v of index.visualEmbeddings) {
                const arr = visualByPath.get(v.path) ?? [];
                arr.push(v);
                visualByPath.set(v.path, arr);
            }
            return scoreSemantic(query, minilmVec, clipVec, index.contentEmbeddings, visualByPath);
        },
        async preloadModels(onProgress?: (m: string) => void): Promise<void> {
            await loadModels(onProgress);
        },
    };
}
