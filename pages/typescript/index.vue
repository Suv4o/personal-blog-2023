<script setup lang="ts">
const { isBlogArticle, isListingPage } = useHelpers();
const route = useRoute();
const { loadPrismScript, unloadPrismScript } = usePrism();

definePageMeta({
    scrollToTop: true,
});

useSeoMeta({
    keywords:
        "TypeScript projects, TypeScript web development, web development tutorials, TypeScript code examples, TypeScript programming, web development with TypeScript, TypeScript development, front-end TypeScript projects, backend TypeScript projects, TypeScript development tutorials",
    description:
        "Browse a curated list of TypeScript-based web development projects on [Your Blog Name]. Discover tutorials, code samples, and insights to level up your skills with TypeScript in web development.",
    ogDescription:
        "Browse a curated list of TypeScript-based web development projects on [Your Blog Name]. Discover tutorials, code samples, and insights to level up your skills with TypeScript in web development.",
    title: "Aleks Trpkovski — TypeScript Projects | Web Development with TypeScript",
    ogTitle: "Aleks Trpkovski — TypeScript Projects | Web Development with TypeScript",
    ogImage:
        "https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_1200,e_sharpen:100/v1618489761/blog/portrait",
    ogUrl: `https://www.trpkovski.com/${route.path}`,
    ogSiteName: "Articles by Aleks Trpkovski",
    twitterTitle: "Aleks Trpkovski — TypeScript Projects | Web Development with TypeScript",
    twitterDescription:
        "Browse a curated list of TypeScript-based web development projects on [Your Blog Name]. Discover tutorials, code samples, and insights to level up your skills with TypeScript in web development.",
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
        <Posts :limit="10" :pagination="true" :search-tag="['TypeScript']" />
    </div>
</template>
