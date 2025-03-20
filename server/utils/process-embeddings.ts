import { pipeline } from "@huggingface/transformers";

export async function processEmbeddings(text: string) {
    const extractor = await pipeline("feature-extraction", "mixedbread-ai/mxbai-embed-large-v1");
    const output = await extractor(text, { pooling: "mean", normalize: true });
    const vector = output.tolist();
    return vector[0];
}
