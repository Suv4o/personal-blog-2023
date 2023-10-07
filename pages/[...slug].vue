<script setup lang="ts">
const nuxtApp = useNuxtApp();
const route = useRoute();
const { loadPrismScript, unloadPrismScript } = usePrism();
const { pagePaths } = useHelpers();

nuxtApp.hook("page:finish", () => {
    window.scrollTo(0, 0);
});

onMounted(() => {
    unloadPrismScript();
    loadPrismScript();
});

const isBlogArticle = computed(() => {
    return !pagePaths.includes(route.path);
});
</script>

<template>
    <header>
        <NavBar />
    </header>
    <main>
        <HomeButton v-if="isBlogArticle" />
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
