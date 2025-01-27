<script setup lang="ts">
const { isBlogArticle, isListingPage } = useHelpers();
const route = useRoute();
const { loadPrismScript, unloadPrismScript } = usePrism();

definePageMeta({
    scrollToTop: true,
});

useSeoMeta({
    keywords:
        "Nest.js, Nest.js development, Nest.js tutorials, web development, Nest.js projects, scalable applications, backend development, Node.js, API development, web development blog",
    description:
        "Explore a collection of Nest.js development projects, tutorials, and best practices on my web development blog. Learn how to build scalable and efficient applications with Nest.js.",
    ogDescription:
        "Explore a collection of Nest.js development projects, tutorials, and best practices on my web development blog. Learn how to build scalable and efficient applications with Nest.js.",
    title: "Aleks Trpkovski — Nest.js Articles | Web Development Blog",
    ogTitle: "Aleks Trpkovski — Nest.js Articles | Web Development Blog",
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
        <Posts :limit="10" :pagination="true" :search-tag="['Nest.js']" @count-loaded-articles="countLoadedArticles" />
    </div>
</template>
