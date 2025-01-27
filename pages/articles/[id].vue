<script setup lang="ts">
const { isBlogArticle, isListingPage } = useHelpers();
const route = useRoute();
const { loadPrismScript, unloadPrismScript } = usePrism();

definePageMeta({
    scrollToTop: true,
});

useSeoMeta({
    keywords:
        "Vue.js, React.js, Nuxt.js, Node.js, Nest.js, Firebase, JavaScript, Frontend Development, Web Development, PHP, Python, AI, Artificial Intelligence, CSS, HTML, Tech Tutorials, Melbourne, Australia, Aleks Trpkovski, Articles, Tutorials, Web Apps, Software Development",
    description:
        "Explore insightful articles and tutorials by Aleks Trpkovski on web development, JavaScript frameworks, AI, and more.",
    ogDescription:
        "Explore insightful articles and tutorials by Aleks Trpkovski on web development, JavaScript frameworks, AI, and more.",
    title: "Aleks Trpkovski — Articles",
    ogTitle: "Aleks Trpkovski — Articles",
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
        <Posts :limit="10" :pagination="true" @count-loaded-articles="countLoadedArticles" />
    </div>
</template>
