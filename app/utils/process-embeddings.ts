import { FeatureExtractionPipeline, pipeline } from "@huggingface/transformers";

export async function processEmbeddings(text: string, extractor: FeatureExtractionPipeline) {
    const output = await extractor(text, { pooling: "mean", normalize: true });
    const vector = output.tolist();
    return vector[0];
}
