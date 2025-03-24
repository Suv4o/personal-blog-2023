<script setup lang="ts">
import type { Article } from "~/types";

const route = useRoute();
const { loadPrismScript, unloadPrismScript } = usePrism();
const { pagePaths, listingPaths } = useHelpers();
const isError = ref(false);
const article = ref<Partial<Article>>();

async function getCurrentArticle() {
    try {
        const { data: page } = await useAsyncData(route.fullPath, () => {
            return queryCollection("content").path(route.path).first();
        });

        return page.value ?? {};
    } catch (error) {
        isError.value = true;
        console.error(error);
    }
}

article.value = await getCurrentArticle();

if (article.value && !Object.keys(article.value).length) {
    isError.value = true;
    throw createError({
        statusCode: 404,
        statusMessage: "Page Not Found",
    });
}

if (!article.value?.body?.value?.length || !article.value?.type) {
    isError.value = true;
}

definePageMeta({
    scrollToTop: true,
});

useSeoMeta({
    keywords: article.value?.keywords?.join(", ") ?? "",
    ogDescription: article.value?.description ?? "",
    description: article.value?.description ?? "",
    ogTitle: article.value?.title ?? "",
    title: article.value?.title ?? "",
    ogImage: article.value?.image ?? "",
    ogUrl: `https://www.trpkovski.com/${route.path}`,
    ogSiteName: article.value?.title ?? "",
    twitterTitle: article.value?.title ?? "",
    twitterDescription: article.value?.description ?? "",
    twitterImage: article.value?.image ?? "",
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

const isBlogArticle = computed(() => {
    return !pagePaths.includes(route.path);
});

const isListingPage = computed(() => {
    return listingPaths.includes(route.path);
});
</script>

<template>
    <HomeButton v-if="isBlogArticle || isListingPage" />
    <ContentRenderer
        v-if="article"
        :value="article"
        class="al-container"
        :class="[isBlogArticle && 'blog-page']"
        :key="route.fullPath"
    />
    <FurtherReading v-if="isBlogArticle && !isError" />
</template>
