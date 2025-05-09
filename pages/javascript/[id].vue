<script setup lang="ts">
const { isBlogArticle, isListingPage } = useHelpers();
const route = useRoute();
const { loadPrismScript, unloadPrismScript } = usePrism();

definePageMeta({
    scrollToTop: true,
});

useSeoMeta({
    keywords:
        "JavaScript tutorials, JavaScript articles, JavaScript tips, frontend development, JavaScript techniques, JavaScript guides, modern JavaScript, web development, coding tips, frontend developer resources",
    description:
        "Explore insightful JavaScript articles and tutorials designed for frontend developers. From core concepts to advanced techniques, stay updated with practical tips and examples.",
    ogDescription:
        "Explore insightful JavaScript articles and tutorials designed for frontend developers. From core concepts to advanced techniques, stay updated with practical tips and examples.",
    title: "Aleks Trpkovski — JavaScript Articles | Tutorials, Tips, and More",
    ogTitle: "Aleks Trpkovski — JavaScript Articles | Tutorials, Tips, and More",
    ogImage:
        "https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_1200,e_sharpen:100/v1744618697/blog/emoji-hi-aleks_vvzmnd",
    ogUrl: `https://www.trpkovski.com/${route.path}`,
    ogSiteName: "Articles by Aleks Trpkovski",
    twitterTitle: "Aleks Trpkovski — JavaScript Articles | Tutorials, Tips, and More",
    twitterDescription:
        "Explore insightful JavaScript articles and tutorials designed for frontend developers. From core concepts to advanced techniques, stay updated with practical tips and examples.",
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
            :search-tag="['JavaScript']"
            @count-loaded-articles="countLoadedArticles"
        />
    </div>
</template>
