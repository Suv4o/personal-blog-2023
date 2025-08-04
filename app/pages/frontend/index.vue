<script setup lang="ts">
const { isBlogArticle, isListingPage } = useHelpers();
const route = useRoute();
const { loadPrismScript, unloadPrismScript } = usePrism();

definePageMeta({
    scrollToTop: true,
});

useSeoMeta({
    keywords:
        "FrontEnd development, FrontEnd tutorials, web development tips, JavaScript frameworks, CSS techniques, UI/UX best practices, frontend tools, modern web design, frontend coding tips",
    description:
        "Explore the latest FrontEnd development tutorials, tips, and tools. From modern frameworks to UI/UX best practices, dive into expert insights and practical guides.",
    ogDescription:
        "Explore the latest FrontEnd development tutorials, tips, and tools. From modern frameworks to UI/UX best practices, dive into expert insights and practical guides.",
    title: "Aleks Trpkovski — FrontEnd Articles | Web Development, JavaScript, CSS, and More",
    ogTitle: "Aleks Trpkovski — FrontEnd Articles | Web Development, JavaScript, CSS, and More",
    ogImage:
        "https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_1200,e_sharpen:100/v1744618697/blog/emoji-hi-aleks_vvzmnd",
    ogUrl: `https://www.trpkovski.com/${route.path}`,
    ogSiteName: "Articles by Aleks Trpkovski",
    twitterTitle: "Aleks Trpkovski — FrontEnd Articles | Web Development, JavaScript, CSS, and More",
    twitterDescription:
        "Explore the latest FrontEnd development tutorials, tips, and tools. From modern frameworks to UI/UX best practices, dive into expert insights and practical guides.",
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
</script>

<template>
    <HomeButton v-if="isBlogArticle || isListingPage" />
    <div class="al-container">
        <Posts :limit="10" :pagination="true" :search-tag="['FrontEnd']" />
    </div>
</template>
