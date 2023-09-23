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
                    href: "https://fonts.googleapis.com/css2?family=Open+Sans&family=Ubuntu:ital,wght@0,300;0,400;0,700;1,400&display=swap",
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
});
