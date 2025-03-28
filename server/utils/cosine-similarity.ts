export function cosineSimilarity(vecA: number[], vecB: number[]): number {
    // Check if both vectors have the same length

    if (vecA.length !== vecB.length) {
        throw new Error("Vectors must have the same length");
    }

    // Calculate dot product and magnitudes of both vectors
    let dotProduct = 0;
    let magnitudeA = 0;
    let magnitudeB = 0;

    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        magnitudeA += vecA[i] * vecA[i];
        magnitudeB += vecB[i] * vecB[i];
    }

    // Calculate magnitudes
    magnitudeA = Math.sqrt(magnitudeA);
    magnitudeB = Math.sqrt(magnitudeB);

    // Avoid division by zero
    if (magnitudeA === 0 || magnitudeB === 0) {
        return 0;
    }

    // Return cosine similarity (a number between 0 and 1)
    return dotProduct / (magnitudeA * magnitudeB);
}
