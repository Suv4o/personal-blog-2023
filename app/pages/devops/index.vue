<script setup lang="ts">
const { isBlogArticle, isListingPage } = useHelpers();
const route = useRoute();
const { loadPrismScript, unloadPrismScript } = usePrism();

definePageMeta({
    scrollToTop: true,
});

useSeoMeta({
    keywords:
        "DevOps, CI/CD, continuous integration, continuous deployment, GitHub Actions, Docker, Kubernetes, automation, infrastructure, deployment pipelines, containerisation, cloud computing, monitoring, testing",
    description:
        "Explore DevOps articles covering CI/CD pipelines, automation, containerisation, and infrastructure best practices. Learn how to streamline your development workflow and deploy with confidence.",
    ogDescription:
        "Explore DevOps articles covering CI/CD pipelines, automation, containerisation, and infrastructure best practices. Learn how to streamline your development workflow and deploy with confidence.",
    title: "Aleks Trpkovski — DevOps Articles | CI/CD, Automation & Infrastructure",
    ogTitle: "Aleks Trpkovski — DevOps Articles | CI/CD, Automation & Infrastructure",
    ogImage:
        "https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_1200,e_sharpen:100/v1744618697/blog/emoji-hi-aleks_vvzmnd",
    ogUrl: `https://www.trpkovski.com/${route.path}`,
    ogSiteName: "Articles by Aleks Trpkovski",
    twitterTitle: "Aleks Trpkovski — DevOps Articles | CI/CD, Automation & Infrastructure",
    twitterDescription:
        "Explore DevOps articles covering CI/CD pipelines, automation, containerisation, and infrastructure best practices. Learn how to streamline your development workflow and deploy with confidence.",
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
        <Posts :limit="10" :pagination="true" :search-tag="['DevOps']" />
    </div>
</template>
