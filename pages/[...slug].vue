<script setup lang="ts">
import type { Article } from "~/types";

const nuxtApp = useNuxtApp();
const route = useRoute();
const { loadPrismScript, unloadPrismScript } = usePrism();
const { pagePaths, listingPaths } = useHelpers();
const isError = ref(false);
const article = ref<Partial<Article>>();

nuxtApp.hook("page:finish", () => {
    window.scrollTo(0, 0);
});

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

if (!article.value?.body?.value?.length) {
    isError.value = true;
}

useSeoMeta({
    keywords: article.value?.keywords?.join(", ") ?? "",
    ogDescription: article.value?.description ?? "",
    ogTitle: article.value?.title ?? "",
    ogImage: article.value?.image ?? "",
    ogUrl: `https://www.trpkovski.com/${route.path}`,
    ogSiteName: article.value?.title ?? "",
    twitterCard: "summary",
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
