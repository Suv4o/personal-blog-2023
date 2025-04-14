<script setup lang="ts">
const { isBlogArticle, isListingPage } = useHelpers();
const route = useRoute();
const { loadPrismScript, unloadPrismScript } = usePrism();

definePageMeta({
    scrollToTop: true,
});

useSeoMeta({
    keywords:
        "Node.js development, Node.js tutorials, Node.js best practices, Node.js resources, backend development, JavaScript, server-side development, Node.js framework, Node.js guide",
    description:
        "Explore a collection of Node.js development tutorials, best practices, and resources. Learn the latest techniques for building scalable and efficient applications with Node.js",
    ogDescription:
        "Explore a collection of Node.js development tutorials, best practices, and resources. Learn the latest techniques for building scalable and efficient applications with Node.js",
    title: "Aleks Trpkovski — Node.js Development Articles | Tutorials, Best Practices, and More",
    ogTitle: "Aleks Trpkovski — Node.js Development Articles | Tutorials, Best Practices, and More",
    ogImage:
        "https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_1200,e_sharpen:100/v1744618697/blog/emoji-hi-aleks_vvzmnd",
    ogUrl: `https://www.trpkovski.com/${route.path}`,
    ogSiteName: "Articles by Aleks Trpkovski",
    twitterTitle: "Aleks Trpkovski — Node.js Development Articles | Tutorials, Best Practices, and More",
    twitterDescription:
        "Explore a collection of Node.js development tutorials, best practices, and resources. Learn the latest techniques for building scalable and efficient applications with Node.js",
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
        <Posts :limit="10" :pagination="true" :search-tag="['Node.js']" />
    </div>
</template>
