import { promises as fs } from "fs";
import { join } from "path";
import { cosineSimilarity } from "../../utils/cosine-similarity";

interface PhotoEmbeddingEntry {
    photoPath: string;
    imagePath: string;
    textEmbedding: number[];
    imageEmbedding: number[];
}

// Visual / textual blend. 0.6 visual leans toward image similarity while still
// letting prose (location, story, gear) shape the ranking. Tune freely.
const ALPHA_VISUAL = 0.6;

function getEmbeddingsFilePath() {
    return join(process.cwd(), "server/utils/photo-embeddings.json");
}

export default defineEventHandler(async (event) => {
    try {
        const { slug } = getRouterParams(event);
        const photoPath = "/" + slug;
        const filePath = getEmbeddingsFilePath();

        try {
            await fs.access(filePath);
        } catch {
            return {
                success: false,
                data: [],
                error: "Photo embeddings file does not exist",
                requestedPath: slug,
            };
        }

        const fileContent = await fs.readFile(filePath, "utf-8");
        const entries: PhotoEmbeddingEntry[] = JSON.parse(fileContent);

        const current = entries.find((p) => p.photoPath === photoPath);
        if (!current) {
            return {
                success: false,
                data: [],
                error: "Photo not found in embeddings file",
                requestedPath: slug,
            };
        }

        const scored = entries
            .filter((p) => p.photoPath !== photoPath)
            .map((p) => {
                const sim_image = cosineSimilarity(current.imageEmbedding, p.imageEmbedding);
                const sim_text = cosineSimilarity(current.textEmbedding, p.textEmbedding);
                const combined = ALPHA_VISUAL * sim_image + (1 - ALPHA_VISUAL) * sim_text;
                return {
                    photoPath: p.photoPath,
                    imagePath: p.imagePath,
                    sim_image,
                    sim_text,
                    combined,
                };
            })
            .sort((a, b) => b.combined - a.combined)
            .slice(0, 3);

        return {
            success: true,
            data: scored,
            alpha: ALPHA_VISUAL,
            requestedPath: slug,
        };
    } catch (error) {
        console.error(`Error reading photo embeddings: ${error instanceof Error ? error.message : String(error)}`);
        return {
            success: false,
            data: [],
            error: error instanceof Error ? error.message : String(error),
        };
    }
});
