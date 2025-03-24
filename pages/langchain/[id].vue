<script setup lang="ts">
const { isBlogArticle, isListingPage } = useHelpers();
const route = useRoute();
const { loadPrismScript, unloadPrismScript } = usePrism();

definePageMeta({
    scrollToTop: true,
});

useSeoMeta({
    keywords:
        "LangChain, LangChain development, LangChain tutorials, LangChain resources, language model development, LangChain projects, AI development, LLMs, language models, machine learning tools, LangChain examples, AI tools, natural language processing, NLP projects",
    description:
        "Explore a curated list of LangChain development projects and resources. Stay updated with the latest tutorials, tools, and examples to leverage LangChain for building powerful language models and applications.",
    ogDescription:
        "Explore a curated list of LangChain development projects and resources. Stay updated with the latest tutorials, tools, and examples to leverage LangChain for building powerful language models and applications.",
    title: "Aleks Trpkovski — LangChain Development | Tutorials, Projects, and More",
    ogTitle: "Aleks Trpkovski — LangChain Development | Tutorials, Projects, and More",
    ogImage:
        "https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_1200,e_sharpen:100/v1618489761/blog/portrait",
    ogUrl: `https://www.trpkovski.com/${route.path}`,
    ogSiteName: "Articles by Aleks Trpkovski",
    twitterTitle: "Aleks Trpkovski — LangChain Development | Tutorials, Projects, and More",
    twitterDescription:
        "Explore a curated list of LangChain development projects and resources. Stay updated with the latest tutorials, tools, and examples to leverage LangChain for building powerful language models and applications.",
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
        <Posts
            :limit="10"
            :pagination="true"
            :search-tag="['LangChain']"
            @count-loaded-articles="countLoadedArticles"
        />
    </div>
</template>
