<script setup lang="ts">
const { isBlogArticle, isListingPage } = useHelpers();
const route = useRoute();
const { loadPrismScript, unloadPrismScript } = usePrism();

definePageMeta({
    scrollToTop: true,
});

useSeoMeta({
    keywords:
        "Python web development, Python projects, web development with Python, Python for web apps, Python web applications, web development projects, Python development tutorials, Python frameworks",
    description:
        "Explore a curated list of Python-based projects for web development. Find inspiration and insights for building powerful web applications using Python.",
    ogDescription:
        "Explore a curated list of Python-based projects for web development. Find inspiration and insights for building powerful web applications using Python.",
    title: "Aleks Trpkovski — Python Projects | Web Development with Python",
    ogTitle: "Aleks Trpkovski — Python Projects | Web Development with Python",
    ogImage:
        "https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_1200,e_sharpen:100/v1744618697/blog/emoji-hi-aleks_vvzmnd",
    ogUrl: `https://www.trpkovski.com/${route.path}`,
    ogSiteName: "Articles by Aleks Trpkovski",
    twitterTitle: "Aleks Trpkovski — Python Projects | Web Development with Python",
    twitterDescription:
        "Explore a curated list of Python-based projects for web development. Find inspiration and insights for building powerful web applications using Python.",
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
        <Posts :limit="10" :pagination="true" :search-tag="['Python']" @count-loaded-articles="countLoadedArticles" />
    </div>
</template>
