<script setup lang="ts">
const { isBlogArticle, isListingPage } = useHelpers();
const route = useRoute();
const { loadPrismScript, unloadPrismScript } = usePrism();

definePageMeta({
    scrollToTop: true,
});

useSeoMeta({
    keywords:
        "Firebase development, Firebase tutorials, Firebase resources, Firebase guides, Firebase web apps, Firebase mobile apps, Firebase tips, Firebase authentication, Firebase database, Firebase hosting, Firebase functions, Firebase for developers, Firebase integration, web development, app development",
    description:
        "Explore comprehensive Firebase development tutorials, tips, and resources. Learn how to build robust web and mobile applications with Firebase's powerful features.",
    ogDescription:
        "Explore comprehensive Firebase development tutorials, tips, and resources. Learn how to build robust web and mobile applications with Firebase's powerful features.",
    title: "Aleks Trpkovski — Firebase Development | Tutorials, Tips, and Resources",
    ogTitle: "Aleks Trpkovski — Firebase Development | Tutorials, Tips, and Resources",
    ogImage:
        "https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_1200,e_sharpen:100/v1744618697/blog/emoji-hi-aleks_vvzmnd",
    ogUrl: `https://www.trpkovski.com/${route.path}`,
    ogSiteName: "Articles by Aleks Trpkovski",
    twitterTitle: "Aleks Trpkovski — Firebase Development | Tutorials, Tips, and Resources",
    twitterDescription:
        "Explore comprehensive Firebase development tutorials, tips, and resources. Learn how to build robust web and mobile applications with Firebase's powerful features.",
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

function countLoadedArticles(count: number) {
    if (!count) {
        throw createError({
            statusCode: 404,
            statusMessage: "Page Not Found",
        });
    }
}
</script>

<template>
    <HomeButton v-if="isBlogArticle || isListingPage" />
    <div class="al-container">
        <Posts :limit="10" :pagination="true" :search-tag="['Firebase']" @count-loaded-articles="countLoadedArticles" />
    </div>
</template>
