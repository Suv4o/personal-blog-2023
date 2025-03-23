import { dirname, join, resolve } from "path";
import { fileURLToPath } from "url";

export function getEmbeddingsFilePath(importMetaUrl: string) {
    const __filename = fileURLToPath(importMetaUrl);
    const __dirname = dirname(__filename);
    const projectRoot = resolve(__dirname, "./");
    const embeddingsDir = join(projectRoot, "server/utils");
    const embeddingsFilePath = join(embeddingsDir, "articles-embeddings.json");

    return {
        projectRoot,
        embeddingsDir,
        embeddingsFilePath,
    };
}
