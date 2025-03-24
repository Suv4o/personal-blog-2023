<script setup lang="ts">
const { isBlogArticle, isListingPage } = useHelpers();
const route = useRoute();
const { loadPrismScript, unloadPrismScript } = usePrism();

definePageMeta({
    scrollToTop: true,
});

useSeoMeta({
    keywords:
        "Nitro development, web development, Nitro projects, modern web development, programming tutorials, web development blog, Nitro framework, web development tips",
    description:
        "Explore my personal blog showcasing cutting-edge Nitro development projects, including tutorials, tips, and best practices to help you stay ahead in the world of modern web development.",
    ogDescription:
        "Explore my personal blog showcasing cutting-edge Nitro development projects, including tutorials, tips, and best practices to help you stay ahead in the world of modern web development.",
    title: "Aleks Trpkovski — Nitro Development Blog | Web Development Projects, Tutorials, and Tips",
    ogTitle: "Aleks Trpkovski — Nitro Development Blog | Web Development Projects, Tutorials, and Tips",
    ogImage:
        "https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_1200,e_sharpen:100/v1618489761/blog/portrait",
    ogUrl: `https://www.trpkovski.com/${route.path}`,
    ogSiteName: "Articles by Aleks Trpkovski",
    twitterTitle: "Aleks Trpkovski — Nitro Development Blog | Web Development Projects, Tutorials, and Tips",
    twitterDescription:
        "Explore my personal blog showcasing cutting-edge Nitro development projects, including tutorials, tips, and best practices to help you stay ahead in the world of modern web development.",
    twitterImage:
        "https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_1200,e_sharpen:100/v1618489761/blog/portrait",
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
        <Posts :limit="10" :pagination="true" :search-tag="['Nitro']" />
    </div>
</template>
