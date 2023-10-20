<script setup lang="ts">
const nuxtApp = useNuxtApp();
const route = useRoute();
const { loadPrismScript, unloadPrismScript } = usePrism();
const { pagePaths, listingPaths } = useHelpers();

nuxtApp.hook("page:finish", () => {
    window.scrollTo(0, 0);
});

useSeoMeta({
    // keywords:
    //     "Vue.js, Javascript, Frontend, Development, Web, Web Developer, PHP, Python, AI, CSS, HTML, Photos, Photography, Melbourne, Australia",
    // ogDescription: "Still about my about page",
    // ogTitle: "About",
    // ogImage: "<>",
    // ogUrl: "https://aleksandartrpkovski.com/about",
    // ogSiteName: "Aleksandar Trpkovski",
    // twitterCard: "summary_large_image",
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
