import { promises as fs } from "fs";
import { dirname, join, resolve } from "path";
import { fileURLToPath } from "url";
import { processEmbeddings } from "../utils/process-embeddings";

export default defineNitroPlugin((nitro) => {
    nitro.hooks.hook("render:html", async (response, { event }) => {
        // Skip processing if the URL doesn't match blog post pattern
        if (!event.node.req.url) return;

        if (!response.body) return;

        // Strip all HTML tags and get only the text content
        const textContent = response.body[0]
            .replace(/<[^>]*>/g, " ") // Replace HTML tags with spaces
            .replace(/\s{2,}/g, " ") // Replace multiple spaces with single space
            .replace(/&nbsp;/g, " ") // Replace &nbsp; with space
            .replace(/&amp;/g, "&") // Replace &amp; with &
            .replace(/&lt;/g, "<") // Replace &lt; with <
            .replace(/&gt;/g, ">") // Replace &gt; with >
            .trim(); // Remove leading/trailing whitespace

        try {
            // Get absolute path to project root and the embeddings file
            const __filename = fileURLToPath(import.meta.url);
            const __dirname = dirname(__filename);
            const projectRoot = resolve(__dirname, "../../");
            const embeddingsDir = join(projectRoot, "server/utils");
            const embeddingsFilePath = join(embeddingsDir, "articles-embeddings.json");

            // Make sure the directory exists
            try {
                await fs.access(embeddingsDir);
            } catch (error) {
                await fs.mkdir(embeddingsDir, { recursive: true });
            }

            // Read existing embeddings or start with an empty array
            let articlesEmbeddings = [];

            try {
                // Check if file exists and read it
                await fs.access(embeddingsFilePath);
                const fileContent = await fs.readFile(embeddingsFilePath, "utf-8");

                try {
                    // Try to parse the JSON content
                    articlesEmbeddings = JSON.parse(fileContent);
                    console.log(`Successfully read ${articlesEmbeddings.length} embeddings from JSON file`);
                } catch (parseError) {
                    console.error(`Error parsing JSON: ${parseError}`);

                    // Create a new clean file if we can't parse
                    console.log("Creating new embeddings JSON file due to parse error");
                    articlesEmbeddings = [];
                }
            } catch (error) {
                // File doesn't exist, initialize with empty array
                console.log("Creating new embeddings JSON file - doesn't exist yet");
            }

            // Validate articlesEmbeddings is an array
            if (!Array.isArray(articlesEmbeddings)) {
                console.error("articlesEmbeddings is not an array, resetting to empty array");
                articlesEmbeddings = [];
            }

            // Check if this URL already exists in the array
            const url = event.node.req.url;
            const existingIndex = articlesEmbeddings.findIndex(
                (item) => item && typeof item === "object" && item.id === url
            );

            if (existingIndex === -1) {
                // Add the new entry
                articlesEmbeddings.push({
                    id: url,
                    embeddings: await processEmbeddings(textContent),
                });

                console.log(`Added embedding for: ${url}. Total: ${articlesEmbeddings.length}`);

                // Save the updated array to the JSON file
                try {
                    // Format JSON in a way that's both human-readable and valid
                    const jsonString = JSON.stringify(articlesEmbeddings, null, 2);

                    // Write to the file
                    await fs.writeFile(embeddingsFilePath, jsonString, "utf-8");
                    console.log("Successfully saved embeddings to JSON file");
                } catch (writeError) {
                    console.error(`Error writing embeddings to file: ${writeError}`);
                }
            } else {
                console.log(`Embedding for ${url} already exists. Total: ${articlesEmbeddings.length}`);
            }
        } catch (error) {
            console.error(`Error updating embeddings: ${error instanceof Error ? error.message : String(error)}`);
        }
    });
});
