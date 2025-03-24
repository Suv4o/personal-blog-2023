<script setup lang="ts">
const { isBlogArticle, isListingPage } = useHelpers();
const route = useRoute();
const { loadPrismScript, unloadPrismScript } = usePrism();

definePageMeta({
    scrollToTop: true,
});

useSeoMeta({
    keywords:
        "CSS development, CSS tutorials, Web development tips, CSS resources, Learn CSS, Modern CSS techniques, Responsive design with CSS, CSS animations, CSS best practices",
    description:
        "Explore the latest CSS development tutorials, tips, and resources to enhance your web development skills. Stay updated with modern CSS techniques and trends!",
    ogDescription:
        "Explore the latest CSS development tutorials, tips, and resources to enhance your web development skills. Stay updated with modern CSS techniques and trends!",
    title: "Aleks Trpkovski — CSS Articles | Web Development Tips, CSS Tutorials, and More",
    ogTitle: "Aleks Trpkovski — CSS Articles | Web Development Tips, CSS Tutorials, and More",
    ogImage:
        "https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_1200,e_sharpen:100/v1618489761/blog/portrait",
    ogUrl: `https://www.trpkovski.com/${route.path}`,
    ogSiteName: "Articles by Aleks Trpkovski",
    twitterTitle: "Aleks Trpkovski — CSS Articles | Web Development Tips, CSS Tutorials, and More",
    twitterDescription:
        "Explore the latest CSS development tutorials, tips, and resources to enhance your web development skills. Stay updated with modern CSS techniques and trends!",
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
        <Posts :limit="10" :pagination="true" :search-tag="['CSS']" @count-loaded-articles="countLoadedArticles" />
    </div>
</template>
