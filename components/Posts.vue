<script setup lang="ts">
import type { Article } from "~/types";

const props = defineProps({
    limit: {
        type: Number,
        default: 10,
    },
    startWithArrow: {
        type: Boolean,
        default: false,
    },
    endWithArrow: {
        type: Boolean,
        default: false,
    },
    readMore: {
        type: Boolean,
        default: false,
    },
    pagination: {
        type: Boolean,
        default: false,
    },
    searchTag: {
        type: Array,
        default: () => [],
    },
});

const route = useRoute();
const serverRenderedArticles = ref();
const serverRenderedArticlesCount = ref();
const articles = ref<Article[]>([]);
const articlesCount = ref();
const fetchCompleted = ref(false);

// Filling the articles array with empty objects to avoid the error of rendering the component before the data is fetched
for (let i = 0; i < props.limit; i++) {
    articles.value.push({
        articleTags: [],
        author: "",
        body: "",
        description: "",
        image: "",
        keywords: [],
        published: "",
        readTime: 5,
        title: "",
        type: "",
        _dir: "",
        _draft: false,
        _extension: "",
        _file: "",
        _id: "",
        _locale: "",
        _partial: false,
        _path: "",
        _source: "",
        _type: "",
    });
}

const searchTerm = computed(() => {
    return props.searchTag as string[];
});

const pageNumber = computed(() => {
    return route.query.page ? parseInt(route.query.page as string) : 1;
});

const hasNextPage = computed(() => {
    return pageNumber.value * props.limit < articlesCount.value;
});

const serverRenderedHasNextPage = computed(() => {
    return pageNumber.value * props.limit < serverRenderedArticlesCount.value;
});

const hasPreviousPage = computed(() => {
    return pageNumber.value > 1;
});

function getTheNumberOfAllArticles() {
    return queryContent()
        .where({ type: "article", articleTags: { $contains: searchTerm.value } })
        .count();
}

function getArticlesFromCurrentPage() {
    return queryContent()
        .where({ type: "article", articleTags: { $contains: searchTerm.value } })
        .sort({ _path: -1 })
        .limit(props.limit)
        .skip(pageNumber.value * props.limit - props.limit)
        .find();
}

let numberOfAllArticles: number;
let allArticles: any[];

try {
    const [number, posts] = await Promise.all([getTheNumberOfAllArticles(), getArticlesFromCurrentPage()]);
    numberOfAllArticles = number;
    allArticles = posts;

    serverRenderedArticlesCount.value = number;
    serverRenderedArticles.value = posts;
} catch (error) {
    fetchCompleted.value = true;
}

watch(
    () => articles.value,
    () => {
        fetchCompleted.value = true;
    }
);

onMounted(() => {
    articlesCount.value = numberOfAllArticles;
    articles.value = allArticles;
});
</script>

<template>
    <div>
        <HomeButton v-if="fetchCompleted && !articles?.length" />
        <NotFound v-if="fetchCompleted && !articles?.length" />
        <div class="relative overflow-hidden">
            <template v-for="(article, index) in serverRenderedArticles" :key="article._path + 'server'">
                <ServerRenderedSinglePost
                    :index="index"
                    :length="serverRenderedArticles.length"
                    :url="article._path"
                    :image="article.image"
                    :title="article.title"
                    :date="article.published"
                    :tags="article.articleTags"
                    :description="article.description"
                    :readMore="readMore"
                    :pagination="pagination"
                    :hasNextPage="serverRenderedHasNextPage"
                    :hasPreviousPage="hasPreviousPage"
                    :pageNumber="pageNumber"
                />
            </template>
        </div>
        <template v-for="(article, index) in articles" :key="article._path">
            <SinglePost
                :index="index"
                :length="articles.length"
                :url="article._path"
                :image="article.image"
                :title="article.title"
                :date="article.published"
                :tags="article.articleTags"
                :description="article.description"
                :startWithArrow="startWithArrow"
                :endWithArrow="endWithArrow"
                :readMore="readMore"
                :pagination="pagination"
                :hasNextPage="hasNextPage"
                :hasPreviousPage="hasPreviousPage"
                :pageNumber="pageNumber"
            />
        </template>
    </div>
</template>
