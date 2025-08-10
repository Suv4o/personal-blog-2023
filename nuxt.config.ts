import tailwindcss from "@tailwindcss/vite";
import fs from "fs";
import path from "path";
import { isBlogPostUrl } from "./app/utils/url-helpers";
import { processEmbeddings } from "./app/utils/process-embeddings";
import { getEmbeddingsFilePath } from "./app/utils/file-paths";
import { pipeline } from "@huggingface/transformers";

async function getAllMarkdownFiles(dirPath: string): Promise<string[]> {
    const files: string[] = [];

    function traverseDirectory(currentPath: string) {
        const entries = fs.readdirSync(currentPath, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = path.join(currentPath, entry.name);

            if (entry.isDirectory()) {
                traverseDirectory(fullPath);
            } else if (entry.isFile() && path.extname(fullPath) === ".md") {
                files.push(fullPath);
            }
        }
    }

    traverseDirectory(dirPath);

    const apiRoutes = files
        .map((file) => {
            let filePath = file.replace("content/", "/").replace(".md", "").replace("index", "");

            if (filePath.endsWith("/") && filePath !== "/") {
                filePath = filePath.slice(0, -1);
            }

            return filePath;
        })
        .filter((filePath) => {
            // Match paths with format: /yyyy/mm/dd/article-slug
            const pathRegex = /\/\d{4}\/\d{2}\/\d{2}\/[\w-]+$/;
            return pathRegex.test(filePath);
        })
        .map((filePath) => `/api/similar-articles${filePath}`);

    const routes = files.map((file) => {
        let filePath = file.replace("content/", "/").replace(".md", "").replace("index", "");

        if (filePath.endsWith("/") && filePath !== "/") {
            filePath = filePath.slice(0, -1);
        }

        return filePath;
    });

    // Read the content of the blog posts
    const urlToRead = routes.filter((url) => isBlogPostUrl(url));

    const markdownFiles = urlToRead.map((url) => {
        return {
            url,
            content: fs.readFileSync(`content${url}.md`, "utf-8"),
        };
    });

    const articlesEmbeddings = [];
    const extractor = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");

    for (const markdown of markdownFiles) {
        const embeddings = await processEmbeddings(markdown.content, extractor);
        const url = markdown.url;
        articlesEmbeddings.push({
            articlePath: url,
            embeddings,
        });
    }

    // Save the updated array to the JSON file
    const jsonString = JSON.stringify(articlesEmbeddings, null, 2);

    // Get the path to the embeddings file
    const { embeddingsDir, embeddingsFilePath } = getEmbeddingsFilePath(import.meta.url);

    // Make sure the directory exists
    if (!fs.existsSync(embeddingsDir)) {
        fs.mkdirSync(embeddingsDir, { recursive: true });
    }

    // Write the JSON string to the file
    fs.writeFileSync(embeddingsFilePath, jsonString);

    console.log(`Embeddings saved to: ${embeddingsFilePath}`);

    return [...routes, ...apiRoutes];
}

export default defineNuxtConfig({
    devtools: { enabled: true },

    components: {
        global: true,
        dirs: ["~/components"],
    },

    app: {
        head: {
            link: [
                { rel: "icon", type: "image/png", href: "/favicon.png" },
                { rel: "preconnect", href: "https://fonts.googleapis.com" },
                { rel: "preconnect", href: "https://fonts.gstatic.com" },
                {
                    rel: "stylesheet",
                    href: "https://fonts.googleapis.com/css2?family=Open+Sans&family=Ubuntu:ital,wght@0,300;0,400;0,700;1,300;1,400&display=swap",
                },
                {
                    rel: "stylesheet",
                    href: "/prism/prism.css",
                },
            ],
            script: [
                {
                    src: `https://www.google.com/recaptcha/api.js?render=${process.env.RE_CAPTCHA_SITE_KEY}`,
                },
                {
                    src: `https://www.googletagmanager.com/gtag/js?id=${process.env.GOOGLE_ANALYTICS_ID}`,
                    async: true,
                },
                {
                    innerHTML: `window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.GOOGLE_ANALYTICS_ID}');`,
                },
            ],
        },
    },

    modules: ["@nuxt/content", "@nuxt/image"],
    css: ["~/assets/css/main.css"],

    typescript: {
        typeCheck: true,
        strict: true,
    },

    runtimeConfig: {
        public: {
            SUBSCRIBE_TO_NEWSLETTERS_URL: process.env.SUBSCRIBE_TO_NEWSLETTERS_URL,
            CONTACT_FORM_URL: process.env.CONTACT_FORM_URL,
            UNSUBSCRIBE_TO_NEWSLETTERS_URL: process.env.UNSUBSCRIBE_TO_NEWSLETTERS_URL,
            RE_CAPTCHA_SITE_KEY: process.env.RE_CAPTCHA_SITE_KEY,
        },
    },

    vite: {
        plugins: [tailwindcss()],
    },

    nitro: {
        prerender: {
            crawlLinks: true,
            concurrency: 1,
            retry: 3,
            routes: [...(await getAllMarkdownFiles("content"))],
        },
    },

    image: {
        format: ["webp", "avif", "jpeg"],
        screens: {
            xs: 320,
            sm: 640,
            md: 768,
            lg: 1024,
            xl: 1280,
            "2xl": 1536,
        },
        densities: [1, 2],
        quality: 80,
        provider: "ipx",
    },
    compatibilityDate: "2025-01-04",
});
