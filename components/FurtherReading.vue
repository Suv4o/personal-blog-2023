<script setup lang="ts">
const previousArticle = ref();
const nextArticle = ref();
const route = useRoute();

async function getThePreviousAndNextArticle() {
    const articles = await queryContent().sort({ _path: -1 }).where({ type: "article" }).find();
    const index = articles.findIndex((article) => article._path === route.path);
    const prev = articles[index + 1];
    const next = articles[index - 1];
    return { prev, next };
}

const { prev, next } = await getThePreviousAndNextArticle();
previousArticle.value = prev;
nextArticle.value = next;
</script>

<template>
    <div class="al-container">
        <h2 class="text-2xl sm:text-3xl font-bold mt-10 text-secondary">Further Reading:</h2>
        <div class="pb-8">
            <div class="flex justify-between flex-wrap">
                <div v-if="!nextArticle"></div>
                <Button v-if="nextArticle" classes="mt-6 mr-6" :link="nextArticle._path" :smallFit="true"
                    >← {{ nextArticle.title }}</Button
                >
                <Button
                    v-if="previousArticle"
                    classes="mt-6 flex-wrap-reverse"
                    :link="previousArticle._path"
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
