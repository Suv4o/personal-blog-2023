<script setup lang="ts">
import SinglePostEmptySkeleton from "./SinglePostEmptySkeleton.vue";
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

const emit = defineEmits(["countLoadedArticles"]);

const route = useRoute();
const articles = ref<Article[]>([]);
const articlesCount = ref();
const fetchCompleted = ref(false);

const searchTerm = computed(() => {
    return props.searchTag as string[];
});

const pageNumber = computed(() => {
    return route.params?.id ? parseInt(route.params?.id as string) : 1;
});

const hasNextPage = computed(() => {
    return pageNumber.value * props.limit < articlesCount.value;
});

const hasPreviousPage = computed(() => {
    return pageNumber.value > 1;
});

const totalPages = computed(() => {
    return Math.ceil(articlesCount.value / props.limit);
});

async function getTheNumberOfAllArticles() {
    if (!searchTerm.value.length) {
        const { data } = await useAsyncData(route.fullPath + "-number-of-pages", () => {
            return queryCollection("content").where("blog", "=", "post").count();
        });

        return data.value ?? 0;
    }

    const { data } = await useAsyncData(route.fullPath + "-number-of-pages-with-tags", () => {
        return queryCollection("content")
            .where("blog", "=", "post")
            .andWhere((qb) => qb.where("articleTags", "LIKE", `%${searchTerm.value.join(",")}%`))
            .count();
    });

    return data.value ?? 0;
}

async function getArticlesFromCurrentPage() {
    if (!searchTerm.value.length) {
        const { data } = await useAsyncData(route.fullPath + "-articles", () => {
            return queryCollection("content")
                .where("blog", "=", "post")
                .limit(props.limit)
                .skip(pageNumber.value * props.limit - props.limit)
                .order("path", "DESC")
                .all();
        });
        return data.value as Article[];
    }

    const { data } = await useAsyncData(route.fullPath + "-articles-with-tags", () => {
        return queryCollection("content")
            .where("blog", "=", "post")
            .andWhere((qb) => qb.where("articleTags", "LIKE", `%${searchTerm.value.join(",")}%`))
            .limit(props.limit)
            .skip(pageNumber.value * props.limit - props.limit)
            .order("path", "DESC")
            .all();
    });
    return data.value as Article[];
}

async function getArticles() {
    try {
        const [number, posts] = await Promise.all([getTheNumberOfAllArticles(), getArticlesFromCurrentPage()]);
        emit("countLoadedArticles", posts?.length);
        articlesCount.value = number;
        articles.value = posts;
        return [number, posts];
    } catch (error) {
        fetchCompleted.value = true;
    }
}

watch(
    () => articles.value,
    () => {
        fetchCompleted.value = true;
    }
);

await getArticles();
</script>

<template>
    <div>
        <SinglePostEmptySkeleton
            v-if="!fetchCompleted"
            :count="limit"
            :readMore="readMore"
            :startWithArrow="startWithArrow"
            :endWithArrow="endWithArrow"
        />
        <div v-show="fetchCompleted" v-for="(article, index) in articles" :key="article.path">
            <SinglePost
                :index="index"
                :length="articles.length"
                :url="article.path"
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
                :totalPages="totalPages"
            />
        </div>
    </div>
</template>
