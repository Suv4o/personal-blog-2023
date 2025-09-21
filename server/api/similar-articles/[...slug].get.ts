import { promises as fs } from "fs";
import { getEmbeddingsFilePath } from "../../utils/file-paths";
import { cosineSimilarity } from "../../utils/cosine-similarity";

interface ArticleEmbeddings {
    articlePath: string;
    embeddings: number[];
    similarity?: number;
}

export default defineEventHandler(async (event) => {
    try {
        const { slug } = getRouterParams(event);

        // Get the path to the embeddings file
        const { embeddingsFilePath } = getEmbeddingsFilePath();

        // Check if the file exists
        try {
            await fs.access(embeddingsFilePath);
        } catch (error) {
            return {
                success: false,
                data: [],
                error: "Embeddings file does not exist",
                requestedPath: slug,
            };
        }

        // Read and parse the JSON file
        const fileContent = await fs.readFile(embeddingsFilePath, "utf-8");
        const articlesEmbeddings = JSON.parse(fileContent);

        const currentArticle = articlesEmbeddings.find(
            (article: ArticleEmbeddings) => article.articlePath === "/" + slug
        );

        const tempData = articlesEmbeddings
            .map((p: ArticleEmbeddings) => ({
                ...p,
                similarity: cosineSimilarity(currentArticle.embeddings, p.embeddings),
            }))
            .sort((a: ArticleEmbeddings, b: ArticleEmbeddings) => (b.similarity ?? 0) - (a.similarity ?? 0));

        const data = tempData
            .filter((article: ArticleEmbeddings) => article.articlePath !== "/" + slug)
            .slice(0, 3) // Limit to only 3 similar articles
            .map(({ similarity, ...rest }: ArticleEmbeddings) => rest) as ArticleEmbeddings[];

        return {
            success: true,
            data,
            requestedPath: slug,
        };
    } catch (error) {
        console.error(`Error reading embeddings file: ${error instanceof Error ? error.message : String(error)}`);

        return {
            success: false,
            data: [],
            error: error instanceof Error ? error.message : String(error),
        };
    }
});
