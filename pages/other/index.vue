<script setup lang="ts">
const { isBlogArticle, isListingPage } = useHelpers();
const route = useRoute();
const { loadPrismScript, unloadPrismScript } = usePrism();

definePageMeta({
    scrollToTop: true,
});

useSeoMeta({
    keywords:
        "web development projects, frontend development, backend development, full-stack development, web development tutorials, coding projects, web development blog, modern web technologies, frontend web development, web development inspiration, coding resources",
    description:
        "Explore a collection of web development projects on my personal blog, showcasing the latest in frontend, backend, and full-stack development. Get inspired, learn, and stay updated with my hands-on experience in modern web technologies.",
    ogDescription:
        "Explore a collection of web development projects on my personal blog, showcasing the latest in frontend, backend, and full-stack development. Get inspired, learn, and stay updated with my hands-on experience in modern web technologies.",
    title: "Aleks Trpkovski — Web Development Projects | Frontend, Backend, Full-Stack",
    ogTitle: "Aleks Trpkovski — Web Development Projects | Frontend, Backend, Full-Stack",
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
        <Posts :limit="10" :pagination="true" :search-tag="['Other']" />
    </div>
</template>
