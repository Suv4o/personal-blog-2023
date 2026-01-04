<script setup lang="ts">
const { isBlogArticle, isListingPage } = useHelpers();
const route = useRoute();
const { loadPrismScript, unloadPrismScript } = usePrism();

definePageMeta({
    scrollToTop: true,
});

useSeoMeta({
    keywords:
        "productivity, developer productivity, workflow tips, efficiency, time management, coding workflow, developer tools, automation, productivity hacks, getting things done, focus, deep work",
    description:
        "Explore productivity articles covering workflow tips, efficiency strategies, and tools to help developers work smarter. Learn how to optimise your coding workflow and get more done.",
    ogDescription:
        "Explore productivity articles covering workflow tips, efficiency strategies, and tools to help developers work smarter. Learn how to optimise your coding workflow and get more done.",
    title: "Aleks Trpkovski — Productivity Articles | Workflow Tips & Developer Efficiency",
    ogTitle: "Aleks Trpkovski — Productivity Articles | Workflow Tips & Developer Efficiency",
    ogImage:
        "https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_1200,e_sharpen:100/v1744618697/blog/emoji-hi-aleks_vvzmnd",
    ogUrl: `https://www.trpkovski.com/${route.path}`,
    ogSiteName: "Articles by Aleks Trpkovski",
    twitterTitle: "Aleks Trpkovski — Productivity Articles | Workflow Tips & Developer Efficiency",
    twitterDescription:
        "Explore productivity articles covering workflow tips, efficiency strategies, and tools to help developers work smarter. Learn how to optimise your coding workflow and get more done.",
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
        <Posts :limit="10" :pagination="true" :search-tag="['Productivity']" />
    </div>
</template>
