import path from "path";
import { fileURLToPath } from "url";
import { buildSearchIndex } from "../app/utils/build-search-index";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");

async function main() {
    const result = await buildSearchIndex({ projectRoot: ROOT });
    console.log(`\nWrote ${result.contentCount} content entries -> ${result.contentPath}`);
    console.log(`Wrote ${result.visualCount} visual entries -> ${result.visualPath}`);
    console.log(`Content by kind: ${JSON.stringify(result.byKind)}`);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
