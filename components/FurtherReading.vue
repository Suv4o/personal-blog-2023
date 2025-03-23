<script setup lang="ts">
import type { Article } from "~/types";

const route = useRoute();
const relatedArticles = ref<Article[]>([]);

// Fetch data during component initialization
const { data: allArticles } = useAsyncData(route.fullPath + "-further-reading", () => {
    return queryCollection("content").where("blog", "=", "post").all() as Promise<Article[]>;
});

const currentArticlePath = route.path;

const { data: similarArticlesData } = useAsyncData(route.fullPath + "-similar-articles", async () => {
    return await $fetch(`/api/similar-articles${currentArticlePath}`);
});

// This function is now synchronous and works with already fetched data
function processRelatedArticles() {
    if (!allArticles.value?.length) {
        return [] as Article[];
    }

    const filteredArticles = allArticles.value.filter((article: Article) => article.path !== currentArticlePath);

    if (filteredArticles.length === 0) {
        return [] as Article[];
    }

    if (similarArticlesData.value && similarArticlesData.value.data.length) {
        return similarArticlesData.value.data
            .map((item) => {
                return filteredArticles.find((article: Article) => article.path === item.articlePath);
            })
            .filter(Boolean) as Article[];
    }

    // Find the index of the current article
    const currentIndex = allArticles.value.findIndex((article: Article) => article.path === currentArticlePath);

    // If somehow the current article isn't found (shouldn't happen), return the first 3 articles
    if (currentIndex === -1) {
        return filteredArticles.slice(0, 3);
    }

    // Create an array to hold our result
    const result = [] as Article[];

    // First, try to add articles that come after the current one
    for (let i = currentIndex + 1; i < allArticles.value.length && result.length < 3; i++) {
        result.push(allArticles.value[i]);
    }

    // Then, try to add articles that come before the current one
    for (let i = currentIndex - 1; i >= 0 && result.length < 3; i--) {
        result.push(allArticles.value[i]);
    }

    // If we still don't have 3 articles, add more from either end
    if (result.length < 3 && filteredArticles.length >= 3) {
        // Find articles we haven't added yet
        const remainingArticles = filteredArticles.filter((article) => !result.some((a) => a.path === article.path));

        // Add as many as needed to reach 3
        result.push(...remainingArticles.slice(0, 3 - result.length));
    }

    return result.slice(0, 3);
}

// Use watch to update relatedArticles whenever the async data is available
watch(
    [allArticles, similarArticlesData],
    () => {
        relatedArticles.value = processRelatedArticles();
    },
    { immediate: true }
);

const posts = computed(() => {
    return relatedArticles.value.map((article) => ({
        id: article.id,
        title: article.title,
        path: article.path,
        description: article.description,
        imageUrl: article.image.replace("w_1200", "h_500"),
        date: article.published,
        datetime: article.published?.replace(/\s/g, "-") || "",
    }));
});
</script>

<template>
    <div class="al-container mt-12">
        <HorizontalRule />
        <div class="py-8">
            <div>
                <div class="mx-auto max-w-2xl text-center">
                    <h2 class="text-4xl font-semibold tracking-tight text-balance text-secondary sm:text-5xl">
                        Further Reading
                    </h2>
                    <p class="mt-2 text-lg/8 text-gray-600">Explore more articles that might interest you.</p>
                </div>
                <div
                    class="mx-auto mt-6 grid auto-rows-fr grid-cols-1 gap-8 sm:mt-10 lg:mx-0 lg:max-w-none lg:grid-cols-3"
                >
                    <article
                        v-for="post in posts"
                        :key="post.id"
                        class="relative isolate flex flex-col justify-end overflow-hidden rounded-2xl bg-gray-900 px-8 pt-80 pb-8 sm:pt-48 lg:pt-80 transform transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-xl"
                    >
                        <img
                            :src="post.imageUrl"
                            alt=""
                            class="absolute inset-0 -z-10 size-full object-cover transition-transform duration-300 ease-out hover:scale-105"
                        />
                        <div class="absolute inset-0 -z-10 bg-linear-to-t from-gray-900 via-gray-900/40" />
                        <div class="absolute inset-0 -z-10 rounded-2xl ring-1 ring-gray-900/10 ring-inset" />

                        <div class="flex flex-wrap items-center gap-y-1 overflow-hidden text-sm/6 text-white">
                            <time :datetime="post.datetime" class="mr-8">{{ post.date }}</time>
                        </div>
                        <h3
                            class="mt-3 text-lg/6 font-semibold text-white transition-colors duration-300 group-hover:text-white"
                        >
                            <NuxtLink :to="post.path" class="transition-opacity duration-300 hover:opacity-80">
                                <span class="absolute inset-0" />
                                {{ post.title }}
                            </NuxtLink>
                        </h3>
                    </article>
                </div>
            </div>
        </div>
        <HorizontalRule />
    </div>
</template>
