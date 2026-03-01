<template>
    <div class="tags" :class="`${small ? 'tags-small' : 'tags-large'}`">
        <NuxtLink
            class="focus:outline-none inline-block hover:scale-110 focus:scale-110 transition-all duration-300 ease-in-out"
            v-for="(tag, index) in tags"
            :key="index"
            :to="getCategory(tag)?.path || '/other'"
        >
            <div
                :class="[
                    getCategory(tag)?.bgClass || 'bg-other',
                    small ? 'text-xs' : 'text-sm',
                    getCategory(tag)?.textClass || 'text-white',
                ]"
            >
                {{ tag }}
            </div>
        </NuxtLink>
    </div>
</template>

<script>
import { CATEGORIES_MAP } from "~/utils/categories";

export default {
    props: {
        tags: {
            type: Array,
            required: true,
        },
        small: {
            type: Boolean,
            default: false,
        },
    },
    methods: {
        getCategory(tag) {
            return CATEGORIES_MAP.get(tag);
        },
    },
};
</script>

<style scoped>
@reference "../assets/css/main.css";

.tags div:hover {
    @apply opacity-80;
}

.tags-large > a:not(:last-child),
button:not(:last-child) {
    @apply mr-3 mb-3;
}

.tags-large div {
    @apply px-4 py-2 rounded-full text-sm;
}

.tags-small > a:not(:last-child),
button:not(:last-child) {
    @apply mr-2 mb-2;
}

.tags-small div {
    @apply px-3 py-1 rounded-full text-xs;
}
</style>
