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
    title: "Aleks Trpkovski — Articles | Web Development, JavaScript, AI, and More",
    ogTitle: "Aleks Trpkovski — Articles | Web Development, JavaScript, AI, and More",
    ogImage:
        "https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_1200,e_sharpen:100/v1618489761/blog/portrait",
    ogUrl: `https://www.trpkovski.com/${route.path}`,
    ogSiteName: "Articles by Aleks Trpkovski",
    twitterTitle: "Aleks Trpkovski — Articles | Web Development, JavaScript, AI, and More",
    twitterDescription:
        "Explore insightful articles and tutorials by Aleks Trpkovski on web development, JavaScript frameworks, AI, and more.",
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
        <Posts :limit="10" :pagination="true" />
    </div>
</template>
