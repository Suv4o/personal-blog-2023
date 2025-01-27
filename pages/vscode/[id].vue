<script setup lang="ts">
const { isBlogArticle, isListingPage } = useHelpers();
const route = useRoute();
const { loadPrismScript, unloadPrismScript } = usePrism();

definePageMeta({
    scrollToTop: true,
});

useSeoMeta({
    keywords:
        "VSCode, web development projects, VSCode tools, coding workflow, VSCode extensions, web development tips, VSCode resources, frontend development, VSCode for developers",
    description:
        "Explore a curated list of VSCode projects for web development. Discover powerful tools, tips, and resources for building efficient web apps and improving your coding workflow.",
    ogDescription:
        "Explore a curated list of VSCode projects for web development. Discover powerful tools, tips, and resources for building efficient web apps and improving your coding workflow.",
    title: "Aleks Trpkovski — VSCode Projects | Web Development, Coding Workflow, and More",
    ogTitle: "Aleks Trpkovski — VSCode Projects | Web Development, Coding Workflow, and More",
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
        <Posts :limit="10" :pagination="true" :search-tag="['VSCode']" />
    </div>
</template>
