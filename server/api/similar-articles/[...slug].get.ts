import { promises as fs } from "fs";
import { getEmbeddingsFilePath } from "../../utils/file-paths";

export default defineEventHandler(async (event) => {
    try {
        const { slug } = getRouterParams(event);

        // Get the path to the embeddings file
        const { embeddingsFilePath } = getEmbeddingsFilePath(import.meta.url);

        // Check if the file exists
        try {
            await fs.access(embeddingsFilePath);
        } catch (error) {
            return {
                success: false,
                error: "Embeddings file does not exist",
                requestedPath: slug,
            };
        }

        // Read and parse the JSON file
        const fileContent = await fs.readFile(embeddingsFilePath, "utf-8");
        const articlesEmbeddings = JSON.parse(fileContent);

        return {
            success: true,
            data: articlesEmbeddings.find(
                (article: { articlePath: string; embeddings: number[] }) => article.articlePath === "/" + slug
            ),
            requestedPath: slug,
        };
    } catch (error) {
        console.error(`Error reading embeddings file: ${error instanceof Error ? error.message : String(error)}`);

        return {
            success: false,
            error: error instanceof Error ? error.message : String(error),
        };
    }
});
