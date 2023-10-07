<script setup lang="ts">
const props = defineProps({
    index: {
        type: Number,
        required: true,
    },
    length: {
        type: Number,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    tags: {
        type: Array,
        required: true,
    },
    readMore: {
        type: Boolean,
        default: false,
    },
    pagination: {
        type: Boolean,
        default: false,
    },
    hasNextPage: {
        type: Boolean,
        default: false,
    },
    hasPreviousPage: {
        type: Boolean,
        default: false,
    },
    pageNumber: {
        type: Number,
        default: 1,
    },
});
</script>

<template>
    <div class="absolute h-0 w-0 invisible">
        <NuxtLink :to="url" tabindex="-1">
            <div>
                <div>
                    <h2>{{ title }}</h2>
                    <p>{{ date }}</p>
                    <div>
                        <ServerRenderedTagPills small :tags="tags" />
                    </div>
                    <p>{{ description }}</p>
                </div>
            </div>
        </NuxtLink>
        <div v-if="readMore && index === length - 1">
            <NuxtLink to="/articles" tabindex="-1">Read More Articles →</NuxtLink>
        </div>
        <div v-if="pagination && index === length - 1">
            <NuxtLink v-if="hasPreviousPage" :to="`?page=${pageNumber - 1}`" tabindex="-1">← Previous</NuxtLink>
            <div v-else></div>
            <NuxtLink v-if="hasNextPage" :to="`?page=${pageNumber + 1}`" tabindex="-1">Next →</NuxtLink>
            <div v-else></div>
        </div>
    </div>
</template>
