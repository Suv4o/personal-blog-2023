import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { pipeline, AutoTokenizer, CLIPTextModelWithProjection } from "@huggingface/transformers";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");

const ALPHA_VISUAL = 0.25;
const MIN_ABSOLUTE_SCORE = 0.25;
const RELATIVE_THRESHOLD = 0.55;
const MAX_PER_KIND = 4;
const MAX_TOTAL_RESULTS = 10;
const LEXICAL_WEIGHT = 0.4;
const MIN_TOKEN_LEN = 3;

interface ContentEntry {
    id: string;
    kind: "article" | "photo" | "keyboard" | "page";
    title: string;
    description: string;
    path: string;
    image?: string;
    keywordHaystack: string;
    textEmbedding: number[];
}

interface VisualEntry {
    id: string;
    kind: "photo" | "keyboard";
    path: string;
    imagePath: string;
    imageEmbedding: number[];
}

interface Scored {
    e: ContentEntry;
    score: number;
}

function cos(a: number[], b: number[]): number {
    let dot = 0;
    let mA = 0;
    let mB = 0;
    for (let i = 0; i < a.length; i++) {
        const x = a[i]!;
        const y = b[i]!;
        dot += x * y;
        mA += x * x;
        mB += y * y;
    }
    if (mA === 0 || mB === 0) return 0;
    return dot / (Math.sqrt(mA) * Math.sqrt(mB));
}

function l2n(v: number[]): number[] {
    let m = 0;
    for (const x of v) m += x * x;
    m = Math.sqrt(m);
    if (m === 0) return v;
    return v.map((x) => x / m);
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

function filterResults(scored: Scored[]): Scored[] {
    const sorted = [...scored].sort((a, b) => b.score - a.score);
    const aboveAbsolute = sorted.filter((r) => r.score >= MIN_ABSOLUTE_SCORE);
    if (aboveAbsolute.length === 0) return [];
    const topScore = aboveAbsolute[0]!.score;
    const cutoff = topScore * RELATIVE_THRESHOLD;
    const aboveRelative = aboveAbsolute.filter((r) => r.score >= cutoff);
    const perKindCount = new Map<string, number>();
    const capped: Scored[] = [];
    for (const r of aboveRelative) {
        const n = perKindCount.get(r.e.kind) ?? 0;
        if (n >= MAX_PER_KIND) continue;
        capped.push(r);
        perKindCount.set(r.e.kind, n + 1);
        if (capped.length >= MAX_TOTAL_RESULTS) break;
    }
    return capped;
}

interface AssertionResult {
    label: string;
    pass: boolean;
    detail?: string;
}

async function main() {
    const contentDoc = JSON.parse(fs.readFileSync(path.join(ROOT, "server/utils/content-embeddings.json"), "utf-8"));
    const visualDoc = JSON.parse(fs.readFileSync(path.join(ROOT, "server/utils/visual-embeddings.json"), "utf-8"));
    const content: ContentEntry[] = contentDoc.entries;
    const visuals: VisualEntry[] = visualDoc.entries;

    const visualByPath = new Map<string, VisualEntry[]>();
    for (const v of visuals) {
        const arr = visualByPath.get(v.path) ?? [];
        arr.push(v);
        visualByPath.set(v.path, arr);
    }

    console.log("Loading MiniLM-L6-v2...");
    const textExtractor = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
    console.log("Loading CLIP-base-patch32 text encoder...");
    const tokenizer = await AutoTokenizer.from_pretrained("Xenova/clip-vit-base-patch32");
    const clipText = await CLIPTextModelWithProjection.from_pretrained("Xenova/clip-vit-base-patch32");

    async function searchAndFilter(query: string): Promise<Scored[]> {
        const minilmOut = await textExtractor(query, { pooling: "mean", normalize: true });
        const minilmVec = (minilmOut.tolist() as number[][])[0]!;
        const tokInputs = await tokenizer(query, { padding: true, truncation: true });
        const clipOut = await clipText(tokInputs);
        const clipVec = l2n((clipOut.text_embeds.tolist() as number[][])[0]!);

        const scored: Scored[] = content.map((e) => {
            const textSim = cos(minilmVec, e.textEmbedding);
            const vis = visualByPath.get(e.path);
            let semantic: number;
            if (vis && vis.length > 0) {
                let best = -Infinity;
                for (const v of vis) {
                    const s = cos(clipVec, v.imageEmbedding);
                    if (s > best) best = s;
                }
                semantic = ALPHA_VISUAL * best + (1 - ALPHA_VISUAL) * textSim;
            } else {
                semantic = textSim;
            }
            const lexical = lexicalScore(query, e.title, e.keywordHaystack);
            const score = (1 - LEXICAL_WEIGHT) * semantic + LEXICAL_WEIGHT * lexical;
            return { e, score };
        });
        return filterResults(scored);
    }

    const assertions: AssertionResult[] = [];
    const queryReports: { query: string; results: Scored[] }[] = [];

    const firebase = await searchAndFilter("firebase");
    queryReports.push({ query: "firebase", results: firebase });
    assertions.push({
        label: "check 9: firebase -> zero keyboards",
        pass: firebase.every((r) => r.e.kind !== "keyboard"),
        detail: firebase.filter((r) => r.e.kind === "keyboard").map((r) => r.e.path).join(", "),
    });
    assertions.push({
        label: "check 10: firebase -> zero photos",
        pass: firebase.every((r) => r.e.kind !== "photo"),
        detail: firebase.filter((r) => r.e.kind === "photo").map((r) => r.e.path).join(", "),
    });
    const firebaseTargets = new Set([
        "/2022/10/07/nestjs-authorisation-with-firebase-auth",
        "/2021/07/13/firebase-authentication-token-verification-with-a-custom-backend-server",
        "/2023/04/02/single-sign-on-with-firebase-authentication-across-multiple-domains",
    ]);
    assertions.push({
        label: "check 11: firebase top 3 includes a firebase article",
        pass: firebase.slice(0, 3).some((r) => firebaseTargets.has(r.e.path)),
    });
    assertions.push({
        label: `check 12: firebase total results between 1 and ${MAX_TOTAL_RESULTS}`,
        pass: firebase.length >= 1 && firebase.length <= MAX_TOTAL_RESULTS,
        detail: `actual=${firebase.length}`,
    });

    const pastel = await searchAndFilter("pastel keyboard");
    queryReports.push({ query: "pastel keyboard", results: pastel });
    assertions.push({
        label: "check 13: pastel keyboard -> zero photos",
        pass: pastel.every((r) => r.e.kind !== "photo"),
        detail: pastel.filter((r) => r.e.kind === "photo").map((r) => r.e.path).join(", "),
    });
    assertions.push({
        label: "check 14: pastel keyboard top 2 includes Bubblegum",
        pass: pastel.slice(0, 2).some((r) => r.e.path === "/the-keyboard-lab/bubblegum"),
    });

    const sunset = await searchAndFilter("sunset photography");
    queryReports.push({ query: "sunset photography", results: sunset });
    const sunsetPhotos = sunset.filter((r) => r.e.kind === "photo").length;
    const sunsetKeyboards = sunset.filter((r) => r.e.kind === "keyboard").length;
    assertions.push({
        label: "check 15: sunset photography -> at least 2 photos AND <= 1 keyboard",
        pass: sunsetPhotos >= 2 && sunsetKeyboards <= 1,
        detail: `photos=${sunsetPhotos} keyboards=${sunsetKeyboards}`,
    });

    const aleks = await searchAndFilter("who is aleks");
    queryReports.push({ query: "who is aleks", results: aleks });
    assertions.push({
        label: "check 16: who is aleks -> About Me in top 3",
        pass: aleks.slice(0, 3).some((r) => r.e.path === "/about-me"),
    });

    const firebaseAuth = await searchAndFilter("firebase auth");
    queryReports.push({ query: "firebase auth", results: firebaseAuth });
    assertions.push({
        label: "check 17: firebase auth top 3 includes Nest.js Authorisation with Firebase Auth (regression)",
        pass: firebaseAuth.slice(0, 3).some((r) => r.e.path === "/2022/10/07/nestjs-authorisation-with-firebase-auth"),
    });

    const bubblegum = await searchAndFilter("bubblegum");
    queryReports.push({ query: "bubblegum", results: bubblegum });
    assertions.push({
        label: "check 22: exact-name 'bubblegum' returns the Bubblegum keyboard as rank 1",
        pass: bubblegum.length > 0 && bubblegum[0]!.e.path === "/the-keyboard-lab/bubblegum",
    });

    const bubbleGumSpaced = await searchAndFilter("bubble gum");
    queryReports.push({ query: "bubble gum", results: bubbleGumSpaced });
    assertions.push({
        label: "check 23: spaced 'bubble gum' returns the Bubblegum keyboard as rank 1",
        pass: bubbleGumSpaced.length > 0 && bubbleGumSpaced[0]!.e.path === "/the-keyboard-lab/bubblegum",
    });

    const lemonMilk = await searchAndFilter("lemon milk");
    queryReports.push({ query: "lemon milk", results: lemonMilk });
    assertions.push({
        label: "check 24: exact-name 'lemon milk' returns the Lemon Milk keyboard as rank 1",
        pass: lemonMilk.length > 0 && lemonMilk[0]!.e.path === "/the-keyboard-lab/lemon-milk",
    });

    const allResults = [firebase, pastel, sunset, aleks, firebaseAuth, bubblegum, bubbleGumSpaced, lemonMilk].flat();
    if (allResults.length > 0) {
        const allTop = new Map<string, number>();
        for (const { query, results } of queryReports) {
            if (results.length > 0) allTop.set(query, results[0]!.score);
        }
        let sanity = true;
        let sanityDetail = "";
        for (const { query, results } of queryReports) {
            if (results.length === 0) continue;
            const top = results[0]!.score;
            for (const r of results) {
                if (r.score < MIN_ABSOLUTE_SCORE - 1e-9 || r.score < top * RELATIVE_THRESHOLD - 1e-9) {
                    sanity = false;
                    sanityDetail = `q="${query}" path=${r.e.path} score=${r.score.toFixed(4)} top=${top.toFixed(4)} cutoff=${(top * RELATIVE_THRESHOLD).toFixed(4)}`;
                    break;
                }
            }
            if (!sanity) break;
        }
        assertions.push({
            label: "check 18: every returned entry >= MIN_ABSOLUTE_SCORE AND >= top * RELATIVE_THRESHOLD",
            pass: sanity,
            detail: sanityDetail,
        });
    }

    for (const { query, results } of queryReports) {
        console.log(`\n--- query: "${query}" (${results.length} results) ---`);
        for (const r of results) {
            console.log(`  ${r.score.toFixed(4)}  ${r.e.kind.padEnd(8)} ${r.e.path} | ${r.e.title.slice(0, 80)}`);
        }
    }

    let pass = 0;
    console.log("\n=== assertions ===");
    for (const a of assertions) {
        const status = a.pass ? "PASS" : "FAIL";
        const tail = a.detail ? `  [${a.detail}]` : "";
        console.log(`[${status}] ${a.label}${tail}`);
        if (a.pass) pass++;
    }
    console.log(`\n${pass}/${assertions.length} assertions passed.`);
    if (pass < assertions.length) process.exit(1);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
