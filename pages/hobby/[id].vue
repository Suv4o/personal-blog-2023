<script setup lang="ts">
const { isBlogArticle, isListingPage } = useHelpers();
const route = useRoute();
const { loadPrismScript, unloadPrismScript } = usePrism();

definePageMeta({
    scrollToTop: true,
});

useSeoMeta({
    keywords:
        "hobbies, fun hobbies, hobby ideas, creative hobbies, leisure activities, DIY projects, crafting, outdoor hobbies, indoor hobbies, new hobbies to try, personal interests, weekend activities, hobby blog, hobby inspiration, hobby exploration, hobby community, hobby enthusiasts, hobby trends, unique hobbies, popular hobbies, hobby resources",
    description:
        "Discover a variety of fun and inspiring hobby ideas on our blog. From creative crafts to outdoor adventures, explore all posts tagged with hobbies and find your next passion project.",
    ogDescription:
        "Discover a variety of fun and inspiring hobby ideas on our blog. From creative crafts to outdoor adventures, explore all posts tagged with hobbies and find your next passion project.",
    title: "Aleks Trpkovski — Hobby Ideas | Explore Fun and Creative Hobbies",
    ogTitle: "Aleks Trpkovski — Hobby Ideas | Explore Fun and Creative Hobbies",
    ogImage:
        "https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_1200,e_sharpen:100/v1744618697/blog/emoji-hi-aleks_vvzmnd",
    ogUrl: `https://www.trpkovski.com/${route.path}`,
    ogSiteName: "Articles by Aleks Trpkovski",
    twitterTitle: "Aleks Trpkovski — Hobby Ideas | Explore Fun and Creative Hobbies",
    twitterDescription:
        "Discover a variety of fun and inspiring hobby ideas on our blog. From creative crafts to outdoor adventures, explore all posts tagged with hobbies and find your next passion project.",
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
        <Posts :limit="10" :pagination="true" :search-tag="['Hobby']" @count-loaded-articles="countLoadedArticles" />
    </div>
</template>
