import { promises as fs } from "fs";
import { dirname, join, resolve } from "path";
import { fileURLToPath } from "url";
import { processEmbeddings } from "../utils/process-embeddings";

// Extend the H3Event type to include our custom property
declare module "h3" {
    interface H3Event {
        _needsEmbeddingProcessing?: boolean;
    }
}

// Flag to track if embeddings are being processed
let isProcessingEmbeddings = false;

export default defineNitroPlugin((nitro) => {
    // Use the request hook which runs before route handling
    nitro.hooks.hook("request", async (event) => {
        // Skip processing if there's no URL
        if (!event.node.req.url) return;

        // Only process blog post URLs (format: /YYYY/MM/DD/blog-slug)
        const blogPostPattern = /^\/\d{4}\/\d{2}\/\d{2}\/[a-zA-Z0-9-]+/;
        if (!blogPostPattern.test(event.node.req.url)) {
            // Not a blog post URL, skip processing
            return;
        }

        // Set the processing flag to true
        isProcessingEmbeddings = true;

        try {
            // Get the URL
            const url = event.node.req.url;

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
                    articlesEmbeddings = [];
                }
            } catch (error) {
                console.log("Creating new embeddings JSON file - doesn't exist yet");
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
            } else {
                console.log(`Embedding for ${url} already exists. Total: ${articlesEmbeddings.length}`);
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
        // Skip processing if there's no URL
        if (!event.node.req.url) return;

        // Only process blog post URLs (format: /YYYY/MM/DD/blog-slug)
        const blogPostPattern = /^\/\d{4}\/\d{2}\/\d{2}\/[a-zA-Z0-9-]+/;
        if (!blogPostPattern.test(event.node.req.url)) {
            // Not a blog post URL, skip processing
            return;
        }

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

            // Get absolute path to project root and the embeddings file
            const __filename = fileURLToPath(import.meta.url);
            const __dirname = dirname(__filename);
            const projectRoot = resolve(__dirname, "../../");
            const embeddingsDir = join(projectRoot, "server/utils");
            const embeddingsFilePath = join(embeddingsDir, "articles-embeddings.json");

            // Read existing embeddings again (in case they changed)
            let articlesEmbeddings = [];
            try {
                const fileContent = await fs.readFile(embeddingsFilePath, "utf-8");
                articlesEmbeddings = JSON.parse(fileContent);
            } catch (error) {
                console.log("Error reading embeddings file, starting with empty array");
            }

            if (!Array.isArray(articlesEmbeddings)) {
                articlesEmbeddings = [];
            }

            // Process embeddings synchronously - this blocks further processing
            console.log(`Processing embeddings for: ${url}`);
            const embeddings = await processEmbeddings(textContent);

            // Add the new entry
            articlesEmbeddings.push({
                articlePath: url,
                embeddings: embeddings,
            });

            console.log(`Added embedding for: ${url}. Total: ${articlesEmbeddings.length}`);

            // Save the updated array to the JSON file
            const jsonString = JSON.stringify(articlesEmbeddings, null, 2);
            await fs.writeFile(embeddingsFilePath, jsonString, "utf-8");
            console.log("Successfully saved embeddings to JSON file");
        } catch (error) {
            console.error(`Error updating embeddings: ${error instanceof Error ? error.message : String(error)}`);
        } finally {
            // Set the processing flag to false
            isProcessingEmbeddings = false;
        }
    });

    // Add a middleware to wait for embeddings processing
    nitro.hooks.hook("beforeResponse", async (event) => {
        // Skip processing if there's no URL
        if (!event.node.req.url) return;

        // Only process blog post URLs (format: /YYYY/MM/DD/blog-slug)
        const blogPostPattern = /^\/\d{4}\/\d{2}\/\d{2}\/[a-zA-Z0-9-]+/;
        if (!blogPostPattern.test(event.node.req.url)) {
            // Not a blog post URL, skip processing
            return;
        }

        // Wait until embedding processing is completed
        while (isProcessingEmbeddings) {
            // Use a small delay to avoid CPU spinning
            await new Promise((resolve) => setTimeout(resolve, 50));
        }
    });
});
