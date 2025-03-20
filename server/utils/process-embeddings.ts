import { pipeline } from "@huggingface/transformers";

export async function processEmbeddings(text: string) {
    const extractor = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
    const output = await extractor(text, { pooling: "mean", normalize: true });
    const vector = output.tolist();
    return vector[0];
}
