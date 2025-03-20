import { promises as fs } from "fs";
import { processEmbeddings } from "../utils/process-embeddings";
import { isBlogPostUrl } from "../utils/url-helpers";
import { getEmbeddingsFilePath } from "../utils/file-paths";

// Extend the H3Event type to include our custom property
declare module "h3" {
    interface H3Event {
        _needsEmbeddingProcessing?: boolean;
    }
}

// Flag to track if embeddings are being processed
let isProcessingEmbeddings = false;

export default defineNitroPlugin(async (nitro) => {
    // Check if prerendering is enabled
    if (!import.meta.prerender) {
        const { embeddingsFilePath } = getEmbeddingsFilePath(import.meta.url);

        try {
            // Check if file already exists
            try {
                await fs.access(embeddingsFilePath);
            } catch {
                // File doesn't exist, create an empty JSON file with an empty array
                const jsonString = JSON.stringify([], null, 2);
                await fs.writeFile(embeddingsFilePath, jsonString, "utf-8");
            }
        } catch (error) {
            console.error(`Error handling embeddings file: ${error instanceof Error ? error.message : String(error)}`);
        }

        // Skip further processing
        return;
    }

    // Use the request hook which runs before route handling
    nitro.hooks.hook("request", async (event) => {
        // Skip if not a blog post URL
        if (!isBlogPostUrl(event.node.req.url)) return;

        // Set the processing flag to true
        isProcessingEmbeddings = true;

        try {
            // Get the URL
            const url = event.node.req.url;

            // Get embeddings file path
            const { embeddingsDir, embeddingsFilePath } = getEmbeddingsFilePath(import.meta.url);

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
                } catch (parseError) {
                    console.error(`Error parsing JSON: ${parseError}`);
                    articlesEmbeddings = [];
                }
            } catch (error) {
                console.error("Creating new embeddings JSON file - doesn't exist yet");
            }

            // Validate articlesEmbeddings is an array
            if (!Array.isArray(articlesEmbeddings)) {
                console.error("articlesEmbeddings is not an array, resetting to empty array");
                articlesEmbeddings = [];
            }

            // Check if this URL already exists in the array
            const existingIndex = articlesEmbeddings.findIndex(
                (item) => item && typeof item === "object" && item.id === url
            );

            if (existingIndex === -1) {
                // We'll need to get the content later during the render:html phase
                // For now, just mark that this URL needs processing
                event._needsEmbeddingProcessing = true;
            }
        } catch (error) {
            console.error(`Error checking embeddings: ${error instanceof Error ? error.message : String(error)}`);
        } finally {
            // Set the processing flag to false
            isProcessingEmbeddings = false;
        }
    });

    // Use render:html hook to get the content and process embeddings if needed
    nitro.hooks.hook("render:html", async (response, { event }) => {
        // Skip if not a blog post URL
        if (!isBlogPostUrl(event.node.req.url)) return;

        if (!response.body || !event._needsEmbeddingProcessing) return;

        // Set the processing flag to true
        isProcessingEmbeddings = true;

        try {
            // Strip all HTML tags and get only the text content
            const textContent = response.body[0]
                .replace(/<[^>]*>/g, " ")
                .replace(/\s{2,}/g, " ")
                .replace(/&nbsp;/g, " ")
                .replace(/&amp;/g, "&")
                .replace(/&lt;/g, "<")
                .replace(/&gt;/g, ">")
                .trim();

            // Get the URL
            const url = event.node.req.url;

            // Get embeddings file path
            const { embeddingsFilePath } = getEmbeddingsFilePath(import.meta.url);

            // Read existing embeddings again (in case they changed)
            let articlesEmbeddings = [];
            try {
                const fileContent = await fs.readFile(embeddingsFilePath, "utf-8");
                articlesEmbeddings = JSON.parse(fileContent);
            } catch (error) {
                console.error("Error reading embeddings file, starting with empty array");
            }

            if (!Array.isArray(articlesEmbeddings)) {
                articlesEmbeddings = [];
            }

            // Process embeddings synchronously - this blocks further processing
            const embeddings = await processEmbeddings(textContent);

            // Add the new entry
            articlesEmbeddings.push({
                articlePath: url,
                embeddings: embeddings,
            });

            // Save the updated array to the JSON file
            const jsonString = JSON.stringify(articlesEmbeddings, null, 2);
            await fs.writeFile(embeddingsFilePath, jsonString, "utf-8");
        } catch (error) {
            console.error(`Error updating embeddings: ${error instanceof Error ? error.message : String(error)}`);
        } finally {
            // Set the processing flag to false
            isProcessingEmbeddings = false;
        }
    });

    // Add a middleware to wait for embeddings processing
    nitro.hooks.hook("beforeResponse", async (event) => {
        // Skip if not a blog post URL
        if (!isBlogPostUrl(event.node.req.url)) return;

        // Wait until embedding processing is completed
        while (isProcessingEmbeddings) {
            // Use a small delay to avoid CPU spinning
            await new Promise((resolve) => setTimeout(resolve, 50));
        }
    });
});
