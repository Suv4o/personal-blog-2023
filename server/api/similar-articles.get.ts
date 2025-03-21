import { promises as fs } from "fs";
import { getEmbeddingsFilePath } from "../utils/file-paths";

export default defineEventHandler(async (event) => {
    try {
        // Get the path to the embeddings file
        const { embeddingsFilePath } = getEmbeddingsFilePath(import.meta.url);

        // Check if the file exists
        try {
            await fs.access(embeddingsFilePath);
        } catch (error) {
            return {
                success: false,
                error: "Embeddings file does not exist",
            };
        }

        // Read and parse the JSON file
        const fileContent = await fs.readFile(embeddingsFilePath, "utf-8");
        const articlesEmbeddings = JSON.parse(fileContent);

        return {
            success: true,
            data: articlesEmbeddings,
        };
    } catch (error) {
        console.error(`Error reading embeddings file: ${error instanceof Error ? error.message : String(error)}`);
        return {
            success: false,
            error: "Failed to read embeddings file",
        };
    }
});
