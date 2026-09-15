<script setup lang="ts">
const { isBlogArticle, isListingPage } = useHelpers();
const route = useRoute();
const { loadPrismScript, unloadPrismScript } = usePrism();

definePageMeta({
    scrollToTop: true,
});

useSeoMeta({
    keywords:
        "Tesla, electric vehicle, EV, Tesla API, vehicle-command, Tesla Bluetooth, home automation, solar charging, Model Y, Tesla open source",
    description:
        "Explore Tesla articles covering vehicle APIs, home automation integrations, and building tools around Tesla's software and hardware.",
    ogDescription:
        "Explore Tesla articles covering vehicle APIs, home automation integrations, and building tools around Tesla's software and hardware.",
    title: "Aleks Trpkovski — Tesla Articles | EV Software & Automation",
    ogTitle: "Aleks Trpkovski — Tesla Articles | EV Software & Automation",
    ogImage:
        "https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_1200,e_sharpen:100/v1744618697/blog/emoji-hi-aleks_vvzmnd",
    ogUrl: `https://www.trpkovski.com/${route.path}`,
    ogSiteName: "Articles by Aleks Trpkovski",
    twitterTitle: "Aleks Trpkovski — Tesla Articles | EV Software & Automation",
    twitterDescription:
        "Explore Tesla articles covering vehicle APIs, home automation integrations, and building tools around Tesla's software and hardware.",
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
        <Posts :limit="10" :pagination="true" :search-tag="['Tesla']" />
    </div>
</template>
