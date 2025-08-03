<script setup lang="ts">
import type { Article } from "~/types";

const { data: allArticles } = useAsyncData("keyboard-suggested-articles", () => {
    return queryCollection("content").where("blog", "=", "post").all() as Promise<Article[]>;
});

const suggestedArticlePaths = [
    "/2025/04/22/how-i-built-a-budget-friendly-custom-mechanical-keyboard-part-1-the-deep-dive-before-the-build",
    "/2025/07/06/how-i-built-a-budget-friendly-custom-mechanical-keyboard-part-2-building-it-together",
];

const suggestedArticles = computed(() => {
    if (!allArticles.value?.length) {
        return [] as Article[];
    }

    return suggestedArticlePaths
        .map((path) => allArticles.value?.find((article: Article) => article.path === path))
        .filter(Boolean) as Article[];
});

const posts = computed(() => {
    return suggestedArticles.value.map((article) => ({
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
    <div class="al-container">
        <div class="py-8">
            <div>
                <div class="mx-auto max-w-2xl text-center">
                    <h2 class="text-3xl font-semibold tracking-tight text-balance text-secondary sm:text-4xl">
                        Suggested Articles
                    </h2>
                    <p class="mt-2 text-lg/8 text-gray-600">
                        Dive deeper into the world of mechanical keyboards with these articles.
                    </p>
                </div>
                <div
                    class="mx-auto mt-6 grid auto-rows-fr grid-cols-1 gap-8 sm:mt-10 lg:mx-0 lg:max-w-none lg:grid-cols-2"
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
                        <div class="absolute inset-0 -z-10 bg-gradient-to-t from-gray-900 via-gray-900/40" />
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
    </div>
</template>
