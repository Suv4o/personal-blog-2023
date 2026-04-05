<script setup lang="ts">
const { isBlogArticle, isListingPage } = useHelpers();
const route = useRoute();
const { loadPrismScript, unloadPrismScript } = usePrism();

definePageMeta({
    scrollToTop: true,
});

useSeoMeta({
    keywords:
        "UI, user interface, UI design, design systems, component design, responsive design, accessibility, UX, web design, interface patterns, visual design",
    description:
        "Explore UI articles covering user interface design, design systems, component patterns, and accessibility best practices. Learn how to create beautiful and functional web interfaces.",
    ogDescription:
        "Explore UI articles covering user interface design, design systems, component patterns, and accessibility best practices. Learn how to create beautiful and functional web interfaces.",
    title: "Aleks Trpkovski — UI Articles | User Interface Design & Patterns",
    ogTitle: "Aleks Trpkovski — UI Articles | User Interface Design & Patterns",
    ogImage:
        "https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_1200,e_sharpen:100/v1744618697/blog/emoji-hi-aleks_vvzmnd",
    ogUrl: `https://www.trpkovski.com/${route.path}`,
    ogSiteName: "Articles by Aleks Trpkovski",
    twitterTitle: "Aleks Trpkovski — UI Articles | User Interface Design & Patterns",
    twitterDescription:
        "Explore UI articles covering user interface design, design systems, component patterns, and accessibility best practices. Learn how to create beautiful and functional web interfaces.",
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
        <Posts :limit="10" :pagination="true" :search-tag="['UI']" />
    </div>
</template>
