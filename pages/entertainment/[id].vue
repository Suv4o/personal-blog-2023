<script setup lang="ts">
const { isBlogArticle, isListingPage } = useHelpers();
const route = useRoute();
const { loadPrismScript, unloadPrismScript } = usePrism();

definePageMeta({
    scrollToTop: true,
});

useSeoMeta({
    keywords:
        "entertainment, tech, technology, books, podcasts, tech reviews, gadgets, software, innovation, book recommendations, tech news",
    description:
        "Explore the intersection of entertainment and technology on our blog. From tech books to tech podcasts to the latest in tech and gadgets it all in one place.",
    ogDescription:
        "Explore the intersection of entertainment and technology on our blog. From tech books to tech podcasts to the latest in tech and gadgets it all in one place.",
    title: "Entertainment | Aleks Trpkovski",
    ogTitle: "Entertainment | Aleks Trpkovski",
    ogImage:
        "https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_1200,e_sharpen:100/v1744618697/blog/emoji-hi-aleks_vvzmnd",
    ogUrl: `https://www.trpkovski.com/${route.path}`,
    ogSiteName: "Articles by Aleks Trpkovski",
    twitterTitle: "Entertainment | Aleks Trpkovski",
    twitterDescription:
        "Explore the intersection of entertainment and technology on our blog. From tech books to tech podcasts to the latest in tech and gadgets it all in one place.",
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
        <Posts
            :limit="10"
            :pagination="true"
            :search-tag="['Entertainment']"
            @count-loaded-articles="countLoadedArticles"
        />
    </div>
</template>
