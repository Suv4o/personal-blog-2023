<script setup lang="ts">
const { isBlogArticle, isListingPage } = useHelpers();
const route = useRoute();
const { loadPrismScript, unloadPrismScript } = usePrism();

definePageMeta({
    scrollToTop: true,
});

useSeoMeta({
    keywords:
        "advice, career tips, developer advice, coding tips, productivity, blogging tips, tech career, software development tips, best practices, learning to code, professional growth, developer journey",
    description:
        "Browse advice articles on career growth, productivity, and developer best practices. Get insights and tips from real experiences in software development and tech.",
    ogDescription:
        "Browse advice articles on career growth, productivity, and developer best practices. Get insights and tips from real experiences in software development and tech.",
    title: "Aleks Trpkovski — Advice Articles | Career Tips, Productivity & Developer Best Practices",
    ogTitle: "Aleks Trpkovski — Advice Articles | Career Tips, Productivity & Developer Best Practices",
    ogImage:
        "https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_1200,e_sharpen:100/v1744618697/blog/emoji-hi-aleks_vvzmnd",
    ogUrl: `https://www.trpkovski.com/${route.path}`,
    ogSiteName: "Articles by Aleks Trpkovski",
    twitterTitle: "Aleks Trpkovski — Advice Articles | Career Tips, Productivity & Developer Best Practices",
    twitterDescription:
        "Browse advice articles on career growth, productivity, and developer best practices. Get insights and tips from real experiences in software development and tech.",
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
        <Posts :limit="10" :pagination="true" :search-tag="['Advice']" @count-loaded-articles="countLoadedArticles" />
    </div>
</template>
