<script setup lang="ts">
const { isBlogArticle, isListingPage } = useHelpers();
const route = useRoute();
const { loadPrismScript, unloadPrismScript } = usePrism();

definePageMeta({
    scrollToTop: true,
});

useSeoMeta({
    keywords:
        "Vite, Vite projects, web development, modern web apps, fast web development, frontend development, Vite tutorials, Vite examples, web app solutions",
    description:
        "Discover a curated list of Vite projects in web development. Explore innovative solutions, best practices, and hands-on examples for building fast and modern web applications with Vite.",
    ogDescription:
        "Discover a curated list of Vite projects in web development. Explore innovative solutions, best practices, and hands-on examples for building fast and modern web applications with Vite.",
    title: "Aleks Trpkovski — Vite Projects | Web Development, Modern Web Apps, and More",
    ogTitle: "Aleks Trpkovski — Vite Projects | Web Development, Modern Web Apps, and More",
    ogImage:
        "https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_1200,e_sharpen:100/v1744618697/blog/emoji-hi-aleks_vvzmnd",
    ogUrl: `https://www.trpkovski.com/${route.path}`,
    ogSiteName: "Articles by Aleks Trpkovski",
    twitterTitle: "Aleks Trpkovski — Vite Projects | Web Development, Modern Web Apps, and More",
    twitterDescription:
        "Discover a curated list of Vite projects in web development. Explore innovative solutions, best practices, and hands-on examples for building fast and modern web applications with Vite.",
    twitterImage:
        "https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_1200,e_sharpen:100/v1744618697/blog/emoji-hi-aleks_vvzmnd",
    twitterCard: "summary",
});

useHead({
    meta: [
        {
            name: "twitter:url",
            content: `https://www.trpkovski.com/${route.path}`,
        },
    ],
});

onMounted(() => {
    unloadPrismScript();
    loadPrismScript();
});
</script>

<template>
    <HomeButton v-if="isBlogArticle || isListingPage" />
    <div class="al-container">
        <Posts :limit="10" :pagination="true" :search-tag="['Vite']" />
    </div>
</template>
