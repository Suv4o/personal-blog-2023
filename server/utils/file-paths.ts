import { join } from "path";

export function getEmbeddingsFilePath() {
    const projectRoot = process.cwd();
    const embeddingsDir = join(projectRoot, "server/utils");
    const embeddingsFilePath = join(embeddingsDir, "articles-embeddings.json");

    return {
        projectRoot,
        embeddingsDir,
        embeddingsFilePath,
    };
}
