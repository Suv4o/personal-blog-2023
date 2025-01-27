<script setup lang="ts">
const { isBlogArticle, isListingPage } = useHelpers();
const route = useRoute();
const { loadPrismScript, unloadPrismScript } = usePrism();

definePageMeta({
    scrollToTop: true,
});

useSeoMeta({
    keywords:
        "Nuxt.js development, Nuxt.js tutorials, Nuxt.js guides, web development, Vue.js, JavaScript frameworks, Nuxt.js best practices, Nuxt.js tips, modern web apps",
    description:
        "Explore a collection of detailed tutorials, guides, and tips focused on Nuxt.js development. Perfect for developers looking to enhance their skills in building modern web applications.",
    ogDescription:
        "Explore a collection of detailed tutorials, guides, and tips focused on Nuxt.js development. Perfect for developers looking to enhance their skills in building modern web applications.",
    title: "Aleks Trpkovski — Nuxt.js Development Articles | Tutorials, Guides, and More",
    ogTitle: "Aleks Trpkovski — Nuxt.js Development Articles | Tutorials, Guides, and More",
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
        <Posts :limit="10" :pagination="true" :search-tag="['Nuxt.js']" @count-loaded-articles="countLoadedArticles" />
    </div>
</template>
