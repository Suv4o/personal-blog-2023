<script setup lang="ts">
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

const articles = ref();

onMounted(async () => {
    articles.value = await queryContent().where({ type: "article" }).sort({ _path: -1 }).limit(props.limit).find();
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
            />
        </template>
    </div>
</template>
