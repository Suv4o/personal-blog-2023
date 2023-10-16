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
            SUBSCRIBE_TO_NEWSLETTERS_URL: process.env.SUBSCRIBE_TO_NEWSLETTERS_URL,
            CONTACT_FORM_URL: process.env.CONTACT_FORM_URL,
            RE_CAPTCHA_SITE_KEY: process.env.RE_CAPTCHA_SITE_KEY,
        },
    },
    nitro: {
        prerender: {
            crawlLinks: true,
        },
    },
});
