<script setup lang="ts">
const nuxtApp = useNuxtApp();
const route = useRoute();
const { loadPrismScript, unloadPrismScript } = usePrism();

nuxtApp.hook("page:finish", () => {
    window.scrollTo(0, 0);
});

onMounted(async () => {
    unloadPrismScript();
    loadPrismScript();
});

const isBlogArticle = computed(() => {
    const blogRoutes = ["/", "/articles", "/vite"];
    return !blogRoutes.includes(route.fullPath);
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
    </main>
    <footer class="al-container">
        <Subscribe />
        <HorizontalRule />
        <p class="text-center text-secondary text-base mt-2 mb-12">
            © <ClientOnly>{{ new Date().getFullYear() }}</ClientOnly> Aleksandar Trpkovski
        </p>
    </footer>
</template>
