<script setup lang="ts">
import { toIsoDate } from "~/utils/article-dates";

const props = defineProps({
    date: {
        type: String,
        default: "",
    },
});

const isoDate = computed(() => toIsoDate(props.date));
</script>

<template>
    <aside v-if="date" class="article-updated">
        <p class="badge">
            <span class="dot"></span>
            <span>Updated <time :datetime="isoDate">{{ date }}</time></span>
        </p>
        <div v-if="$slots.default" class="note">
            <slot />
        </div>
    </aside>
</template>

<style scoped>
@reference "../assets/css/main.css";

.article-updated {
    @apply my-6;
}

.article-updated .badge {
    @apply my-0 inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1 text-base not-italic text-beige-light;
}

.article-updated .dot {
    @apply inline-block h-2 w-2 shrink-0 rounded-full bg-green-light;
}

.article-updated .note {
    @apply mt-3 rounded-md border-l-4 border-green bg-green-blue px-4 py-1 text-lg text-secondary antialiased;
}

.article-updated .note :deep(p) {
    @apply my-4;
}

.article-updated .note :deep(a) {
    @apply text-primary;
}
</style>
