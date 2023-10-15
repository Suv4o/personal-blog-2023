import fs from "fs";
import path from "path";

function getAllMarkdownFiles(dirPath: string): string[] {
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

    return files.map((file) => {
        return file.replace("content/", "/").replace(".md", "").replace("index", "");
    });
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
            ],
        },
    },
    modules: ["@nuxt/content"],
    css: ["~/assets/css/main.css"],
    postcss: {
        plugins: {
            tailwindcss: {},
            autoprefixer: {},
        },
    },
    typescript: {
        typeCheck: true,
        strict: true,
    },
    runtimeConfig: {
        public: {
            BACKEND_API_URL: process.env.BACKEND_API_URL,
            RE_CAPTCHA_SITE_KEY: process.env.RE_CAPTCHA_SITE_KEY,
        },
    },
    nitro: {
        prerender: {
            crawlLinks: true,
            routes: getAllMarkdownFiles("content"),
        },
    },
    // generate: { routes: getAllMarkdownFiles("content") },
});
