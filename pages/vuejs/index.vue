<script setup lang="ts">
const { isBlogArticle, isListingPage } = useHelpers();
const route = useRoute();
const { loadPrismScript, unloadPrismScript } = usePrism();

definePageMeta({
    scrollToTop: true,
});

useSeoMeta({
    keywords:
        "Vue.js, web development, Vue.js projects, Vue.js tutorials, Vue.js resources, front-end development, JavaScript, web development projects, personal blog, coding projects, Vue.js solutions, web app development, Vue.js code snippets",
    description:
        "Explore a curated list of Vue.js projects in web development. Discover innovative solutions, tutorials, and resources for mastering Vue.js. Perfect for developers looking to expand their skills with practical examples and code snippets.",
    ogDescription:
        "Explore a curated list of Vue.js projects in web development. Discover innovative solutions, tutorials, and resources for mastering Vue.js. Perfect for developers looking to expand their skills with practical examples and code snippets.",
    title: "Aleks Trpkovski — Vue.js Projects | Web Development, Front-End Solutions, and More",
    ogTitle: "Aleks Trpkovski — Vue.js Projects | Web Development, Front-End Solutions, and More",
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
        <Posts :limit="10" :pagination="true" :search-tag="['Vue.js']" />
    </div>
</template>
