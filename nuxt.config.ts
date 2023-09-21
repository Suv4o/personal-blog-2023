export default defineNuxtConfig({
    devtools: { enabled: true },
    app: {
        head: {
            link: [{ rel: "icon", type: "image/png", href: "/favicon.png" }],
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
