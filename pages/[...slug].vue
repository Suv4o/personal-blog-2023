<script setup lang="ts">
import { Article } from "~/types";

const nuxtApp = useNuxtApp();
const route = useRoute();
const { loadPrismScript, unloadPrismScript } = usePrism();
const { pagePaths, listingPaths } = useHelpers();
const article = ref<Partial<Article>>();

nuxtApp.hook("page:finish", () => {
    window.scrollTo(0, 0);
});

async function getCurrentArticle() {
    return await queryContent().where({ _path: route.path }).findOne();
}

article.value = await getCurrentArticle();

useSeoMeta({
    keywords: article.value?.keywords?.join(", ") ?? "",
    ogDescription: article.value?.description ?? "",
    ogTitle: article.value?.title ?? "",
    ogImage: article.value?.image ?? "",
    ogUrl: `https://www.trpkovski.com/${route.path}`,
    ogSiteName: article.value?.title ?? "",
    twitterCard: "summary_large_image",
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
    <header>
        <NavBar />
    </header>
    <main class="overflow-hidden">
        <HomeButton v-if="isBlogArticle || isListingPage" />
        <ContentDoc class="al-container" :class="[isBlogArticle && 'blog-page']" :key="route.fullPath">
            <template #not-found>
                <NotFound />
            </template>
        </ContentDoc>
        <FurtherReading v-if="isBlogArticle" />
    </main>
    <footer class="al-container">
        <Subscribe />
        <HorizontalRule />
        <p class="text-center text-secondary text-base mt-2 mb-12">
            © <ClientOnly>{{ new Date().getFullYear() }}</ClientOnly> Aleksandar Trpkovski
        </p>
    </footer>
</template>

<style>
.grecaptcha-badge {
    @apply hidden;
}
</style>
