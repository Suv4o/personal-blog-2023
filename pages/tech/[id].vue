<script setup lang="ts">
const { isBlogArticle, isListingPage } = useHelpers();
const route = useRoute();
const { loadPrismScript, unloadPrismScript } = usePrism();

definePageMeta({
    scrollToTop: true,
});

useSeoMeta({
    keywords:
        "technology, tech news, tech tips, gadgets, AI, artificial intelligence, web development, software, coding, tech trends, digital tools, programming, innovation, tech tutorials",
    description:
        "Stay up-to-date with the latest in tech on our blog. Explore all posts tagged with Tech—covering gadgets, software, AI, web development, and the future of technology.",
    ogDescription:
        "Stay up-to-date with the latest in tech on our blog. Explore all posts tagged with Tech—covering gadgets, software, AI, web development, and the future of technology.",
    title: "Aleks Trpkovski — Tech Articles | Explore the Latest in Technology",
    ogTitle: "Aleks Trpkovski — Tech Articles | Explore the Latest in Technology",
    ogImage:
        "https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_1200,e_sharpen:100/v1744618697/blog/emoji-hi-aleks_vvzmnd",
    ogUrl: `https://www.trpkovski.com/${route.path}`,
    ogSiteName: "Articles by Aleks Trpkovski",
    twitterTitle: "Aleks Trpkovski — Tech Articles | Explore the Latest in Technology",
    twitterDescription:
        "Stay up-to-date with the latest in tech on our blog. Explore all posts tagged with Tech—covering gadgets, software, AI, web development, and the future of technology.",
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
        <Posts :limit="10" :pagination="true" :search-tag="['Tech']" @count-loaded-articles="countLoadedArticles" />
    </div>
</template>
