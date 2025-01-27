<script setup lang="ts">
const { isBlogArticle, isListingPage } = useHelpers();
const route = useRoute();
const { loadPrismScript, unloadPrismScript } = usePrism();

definePageMeta({
    scrollToTop: true,
});

useSeoMeta({
    keywords:
        "Backend Development, Node.js Tutorials, Python for Backend, Backend Development Best Practices, Learn Node.js Backend, Python Backend Articles, Backend Development Tips, Node.js vs Python for Backend, Backend Development Insights",
    description:
        "Explore the best articles on backend development featuring Node.js and Python. Get practical insights, tutorials, and best practices to enhance your backend development skills.",
    ogDescription:
        "Explore the best articles on backend development featuring Node.js and Python. Get practical insights, tutorials, and best practices to enhance your backend development skills.",
    title: "Aleks Trpkovski — Backend Development Articles | Node.js, Python, and More",
    ogTitle: "Aleks Trpkovski — Backend Development Articles | Node.js, Python, and More",
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
        <Posts :limit="10" :pagination="true" :search-tag="['BackEnd']" />
    </div>
</template>
