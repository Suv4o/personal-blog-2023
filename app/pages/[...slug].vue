<script setup lang="ts">
import type { Article } from "~/types";

const route = useRoute();
const { loadPrismScript, unloadPrismScript } = usePrism();
const isError = ref(false);
const article = ref<Partial<Article>>();
const galleryImages = ref<any[]>([]);

const { pagePaths, listingPaths, isThroughTheLensSlugPage, isPhotoPage, currentImageSlug } = useHelpers(article);

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

async function getGalleryImages() {
    if (!isThroughTheLensSlugPage.value) return [];

    try {
        // Extract gallery name from route (e.g., "/through-the-lens/starlit-wonders/some-image" -> "starlit-wonders")
        const pathParts = route.path.split("/").filter(Boolean);
        if (pathParts.length >= 3 && pathParts[0] === "through-the-lens") {
            const galleryName = pathParts[1];
            const galleryPath = `/through-the-lens/${galleryName}`;

            const { data: galleryPage } = await useAsyncData(`gallery-${galleryName}`, () => {
                return queryCollection("content").path(galleryPath).first();
            });

            return (galleryPage.value as any)?.meta?.gridImages || [];
        }
    } catch (error) {
        console.error("Error fetching gallery images:", error);
    }

    return [];
}

article.value = await getCurrentArticle();
galleryImages.value = await getGalleryImages();

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
    ogType: "article",
    ogImageWidth: 1200,
    ogImageHeight: 630,
    ogLocale: "en_AU",
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
        :class="[(isBlogArticle || isThroughTheLensSlugPage) && 'blog-page']"
        :key="route.fullPath"
    />
    <ThroughTheLensImageNavigation
        v-if="isPhotoPage && galleryImages.length > 0"
        :images="galleryImages"
        :current-image-slug="currentImageSlug"
    />
    <FurtherReading v-if="isBlogArticle && !isError" />
</template>
