export function cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) throw new Error("Vectors must have the same length");
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
