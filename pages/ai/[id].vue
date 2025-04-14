<script setup lang="ts">
const { isBlogArticle, isListingPage } = useHelpers();
const route = useRoute();
const { loadPrismScript, unloadPrismScript } = usePrism();

definePageMeta({
    scrollToTop: true,
});

useSeoMeta({
    keywords:
        "Artificial Intelligence articles, AI insights, machine learning trends, AI advancements, AI tutorials, AI blogs, artificial intelligence news, AI developments, AI technology updates",
    description:
        "Dive into our curated collection of articles on Artificial Intelligence. Stay updated with the latest advancements, trends, and insights in AI, machine learning, and more.",
    ogDescription:
        "Dive into our curated collection of articles on Artificial Intelligence. Stay updated with the latest advancements, trends, and insights in AI, machine learning, and more.",
    title: "Aleks Trpkovski — AI Articles | Machine Learning, AI Trends, and More",
    ogTitle: "Aleks Trpkovski — AI Articles | Machine Learning, AI Trends, and More",
    ogImage:
        "https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_1200,e_sharpen:100/v1744618697/blog/emoji-hi-aleks_vvzmnd",
    ogUrl: `https://www.trpkovski.com/${route.path}`,
    ogSiteName: "Articles by Aleks Trpkovski",
    twitterTitle: "Aleks Trpkovski — AI Articles | Machine Learning, AI Trends, and More",
    twitterDescription:
        "Dive into our curated collection of articles on Artificial Intelligence. Stay updated with the latest advancements, trends, and insights in AI, machine learning, and more.",
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
        <Posts :limit="10" :pagination="true" :search-tag="['AI']" @count-loaded-articles="countLoadedArticles" />
    </div>
</template>
