<script setup lang="ts">
import type { Article } from "~/types";

const previousArticle = ref();
const nextArticle = ref();
const route = useRoute();

async function getThePreviousAndNextArticle() {
    const { data: articles } = await useAsyncData(route.fullPath + "-further-reading", () => {
        return queryCollection("content").where("blog", "=", "post").all() as Promise<Article[]>;
    });

    if (!articles.value?.length) {
        return;
    }

    const index = articles.value.findIndex((article: Article) => article.path === route.path);
    const prev = articles.value[index + 1];
    const next = articles.value[index - 1];
    return { prev, next };
}

const { prev, next } = (await getThePreviousAndNextArticle()) as { prev: Article; next: Article };
previousArticle.value = prev;
nextArticle.value = next;
</script>

<template>
    <div class="al-container">
        <h2 class="text-2xl sm:text-3xl font-bold mt-10 text-secondary">Further Reading:</h2>
        <div class="pb-8">
            <div class="flex justify-between flex-wrap">
                <div v-if="!nextArticle"></div>
                <Button v-if="nextArticle" classes="mt-6 mr-6" :link="nextArticle.path" :smallFit="true"
                    >← {{ nextArticle.title }}</Button
                >
                <Button
                    v-if="previousArticle"
                    classes="mt-6 flex-wrap-reverse"
                    :link="previousArticle.path"
                    :smallFit="true"
                    ><span class="sm:hidden">→ </span>{{ previousArticle.title }}
                    <span class="hidden sm:inline-block"> →</span></Button
                >
                <div v-if="!previousArticle"></div>
            </div>
        </div>
        <HorizontalRule />
    </div>
</template>
