import { pipeline } from "@huggingface/transformers";

export async function processEmbeddings(embeddings: string) {
    const extractor = await pipeline("feature-extraction", "nomic-ai/nomic-embed-text-v1.5");
    const output = await extractor(embeddings, { pooling: "mean", normalize: true });
    const vector = output.tolist();
    return vector[0];
}
