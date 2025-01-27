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
        "https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_1200,e_sharpen:100/v1618489761/blog/portrait",
    ogUrl: `https://www.trpkovski.com/${route.path}`,
    ogSiteName: "Articles by Aleks Trpkovski",
    twitterCard: "summary",
});

onMounted(() => {
    unloadPrismScript();
    loadPrismScript();
});

function countLoadedArticles(count: number) {
    if (!count) {
        throw createError({
            statusCode: 404,
            statusMessage: "Page Not Found",
        });
    }
}
</script>

<template>
    <HomeButton v-if="isBlogArticle || isListingPage" />
    <div class="al-container">
        <Posts :limit="10" :pagination="true" :search-tag="['Vite']" @count-loaded-articles="countLoadedArticles" />
    </div>
</template>
