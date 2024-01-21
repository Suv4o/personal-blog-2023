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
        return await queryContent().where({ _path: route.path }).findOne();
    } catch (error) {
        isError.value = true;
        console.error(error);
    }
}

article.value = await getCurrentArticle();

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
    <div :class="isError && 'flex flex-col h-screen'">
        <header>
            <NavBar />
        </header>
        <main class="overflow-hidden" :class="isError && 'flex-grow'">
            <HomeButton v-if="isBlogArticle || isListingPage" />
            <ContentDoc class="al-container" :class="[isBlogArticle && 'blog-page']" :key="route.fullPath">
                <template #not-found>
                    <NotFound />
                </template>
            </ContentDoc>
            <FurtherReading v-if="isBlogArticle && !isError" />
            <NuxtLink to="/unsubscribe" class="block h-0 w-0 invisible pointer-events-none" tabindex="0"
                >unsubscribe</NuxtLink
            >
        </main>
        <footer class="al-container" :class="isError && 'flex-shrink-0'">
            <Subscribe v-if="!isError" />
            <HorizontalRule />
            <p class="text-center text-secondary text-base mt-2 mb-12">
                © <ClientOnly>{{ new Date().getFullYear() }}</ClientOnly> Aleksandar Trpkovski
            </p>
        </footer>
    </div>
</template>

<style>
.grecaptcha-badge {
    @apply hidden;
}
</style>
