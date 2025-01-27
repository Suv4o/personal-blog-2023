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
        "https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_1200,e_sharpen:100/v1618489761/blog/portrait",
    ogUrl: `https://www.trpkovski.com/${route.path}`,
    ogSiteName: "Articles by Aleks Trpkovski",
    twitterCard: "summary",
});

onMounted(() => {
    unloadPrismScript();
    loadPrismScript();
});
</script>

<template>
    <HomeButton v-if="isBlogArticle || isListingPage" />
    <div class="al-container">
        <Posts :limit="10" :pagination="true" :search-tag="['React.js']" />
    </div>
</template>
