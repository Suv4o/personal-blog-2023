<script setup lang="ts">
const { isBlogArticle, isListingPage } = useHelpers();
const route = useRoute();
const { loadPrismScript, unloadPrismScript } = usePrism();

definePageMeta({
    scrollToTop: true,
});

useSeoMeta({
    keywords:
        "React.js, React projects, web development, JavaScript, React tutorials, frontend development, React code examples, React best practices, web development projects, React apps",
    description:
        "Explore a curated collection of React.js projects in web development. Find tutorials, code examples, and best practices to level up your React skills.",
    ogDescription:
        "Explore a curated collection of React.js projects in web development. Find tutorials, code examples, and best practices to level up your React skills.",
    title: "Aleks Trpkovski — React.js Projects | Web Development with React",
    ogTitle: "Aleks Trpkovski — React.js Projects | Web Development with React",
    ogImage:
        "https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_1200,e_sharpen:100/v1744618697/blog/emoji-hi-aleks_vvzmnd",
    ogUrl: `https://www.trpkovski.com/${route.path}`,
    ogSiteName: "Articles by Aleks Trpkovski",
    twitterTitle: "Aleks Trpkovski — React.js Projects | Web Development with React",
    twitterDescription:
        "Explore a curated collection of React.js projects in web development. Find tutorials, code examples, and best practices to level up your React skills.",
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
        <Posts :limit="10" :pagination="true" :search-tag="['React.js']" @count-loaded-articles="countLoadedArticles" />
    </div>
</template>
