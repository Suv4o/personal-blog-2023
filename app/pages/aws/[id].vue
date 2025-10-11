<script setup lang="ts">
const { isBlogArticle, isListingPage } = useHelpers();
const route = useRoute();
const { loadPrismScript, unloadPrismScript } = usePrism();

definePageMeta({
    scrollToTop: true,
});

useSeoMeta({
    keywords:
        "AWS, Amazon Web Services, cloud computing, serverless architecture, AWS tutorials, AWS best practices, cloud infrastructure, DevOps, scalable systems, cloud security, AWS Lambda, AWS SQS, AWS SNS, AWS microservices, cloud-native applications",
    description:
        "Browse hands-on AWS tutorials, architecture guides, and best practices for building scalable, resilient cloud applications. Learn how to design, deploy, and operate modern systems on Amazon Web Services.",
    ogDescription:
        "Browse hands-on AWS tutorials, architecture guides, and best practices for building scalable, resilient cloud applications. Learn how to design, deploy, and operate modern systems on Amazon Web Services.",
    title: "Aleks Trpkovski — AWS Cloud Articles | Tutorials, Architecture Guides, and Best Practices",
    ogTitle: "Aleks Trpkovski — AWS Cloud Articles | Tutorials, Architecture Guides, and Best Practices",
    ogImage:
        "https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_1200,e_sharpen:100/v1744618697/blog/emoji-hi-aleks_vvzmnd",
    ogUrl: `https://www.trpkovski.com/${route.path}`,
    ogSiteName: "Articles by Aleks Trpkovski",
    twitterTitle: "Aleks Trpkovski — AWS Cloud Articles | Tutorials, Architecture Guides, and Best Practices",
    twitterDescription:
        "Browse hands-on AWS tutorials, architecture guides, and best practices for building scalable, resilient cloud applications. Learn how to design, deploy, and operate modern systems on Amazon Web Services.",
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
        <Posts :limit="10" :pagination="true" :search-tag="['AWS']" @count-loaded-articles="countLoadedArticles" />
    </div>
</template>
