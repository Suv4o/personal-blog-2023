<script setup lang="ts">
const route = useRoute();
const { loadPrismScript, unloadPrismScript } = usePrism();
const { delay } = useHelpers();

onMounted(() => {
    loadPrismScript();
});

watch(
    () => route.fullPath,
    async () => {
        await delay();
        unloadPrismScript();
        loadPrismScript();
    },
    { deep: true }
);

const isBlogArticle = computed(() => {
    const blogRoutes = ["/"];
    return blogRoutes.findIndex((r) => r !== route.fullPath) >= 0;
});
</script>

<template>
    <header>
        <NavBar />
    </header>
    <main>
        <HomeButton v-if="isBlogArticle" />
        <ContentDoc class="al-container" :class="[isBlogArticle && 'blog-page']">
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
