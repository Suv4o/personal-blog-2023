<script setup lang="ts">
const route = useRoute();
const articles = ref();
const articlesCount = ref();

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
});

const pageNumber = computed(() => {
    return route.query.page ? parseInt(route.query.page as string) : 1;
});

const hasNextPage = computed(() => {
    return pageNumber.value * props.limit < articlesCount.value;
});

const hasPreviousPage = computed(() => {
    return pageNumber.value > 1;
});

function getTheNumberOfAllArticles() {
    return queryContent().where({ type: "article" }).count();
}

function getArticlesFromCurrentPage() {
    return queryContent()
        .where({ type: "article" })
        .sort({ _path: -1 })
        .limit(props.limit)
        .skip(pageNumber.value * props.limit - props.limit)
        .find();
}

onMounted(async () => {
    const [numberOfAllArticles, allArticles] = await Promise.all([
        getTheNumberOfAllArticles(),
        getArticlesFromCurrentPage(),
    ]);
    articlesCount.value = numberOfAllArticles;
    articles.value = allArticles;
});
</script>

<template>
    <div>
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
