<script setup lang="ts">
const route = useRoute();
const { loadPrismScript } = usePrism();

onMounted(() => {
    loadPrismScript();
});

const applyBlogClass = computed(() => {
    const blogRoutes = ["/"];
    return blogRoutes.findIndex((r) => r !== route.fullPath) >= 0;
});
</script>

<template>
    <header>
        <NavBar />
    </header>
    <main>
        <ContentDoc class="al-container blog-page" :class="applyBlogClass && 'blog-page'">
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
