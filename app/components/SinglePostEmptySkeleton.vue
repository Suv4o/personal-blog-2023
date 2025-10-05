<script setup lang="ts">
const props = defineProps({
    count: {
        type: Number,
        default: 3,
    },
    readMore: {
        type: Boolean,
        default: false,
    },
    startWithArrow: {
        type: Boolean,
        default: false,
    },
    endWithArrow: {
        type: Boolean,
        default: false,
    },
});

const skeletonTagPlaceholders = [0, 1, 2];
const skeletonDescriptionLines = [0, 1, 2];
</script>

<template>
    <div>
        <template v-for="index in props.count" :key="`skeleton-${index}`">
            <ArrowDown v-if="startWithArrow && index === 1" />
            <div class="block w-full h-80 bg-beige rounded-md my-9 overflow-hidden skeleton-card">
                <div class="sm:flex h-full animate-pulse">
                    <div class="hidden sm:block sm:w-6/12 h-full bg-gray-300/60"></div>
                    <div class="w-full sm:w-7/12 h-full px-4 sm:px-10 py-6 flex flex-col justify-center space-y-4">
                        <div class="h-8 bg-gray-300/80 rounded"></div>
                        <div class="h-4 w-32 bg-gray-300/70 rounded"></div>
                        <div class="flex gap-3">
                            <div
                                v-for="tagIndex in skeletonTagPlaceholders"
                                :key="`skeleton-tag-${tagIndex}`"
                                class="h-6 w-16 bg-gray-300/70 rounded-full"
                            ></div>
                        </div>
                        <div class="space-y-2">
                            <div
                                v-for="lineIndex in skeletonDescriptionLines"
                                :key="`skeleton-line-${lineIndex}`"
                                class="h-3 bg-gray-300/70 rounded"
                                :class="lineIndex === skeletonDescriptionLines.length - 1 ? 'w-5/6' : 'w-full'"
                            ></div>
                        </div>
                    </div>
                </div>
            </div>
            <ArrowDown v-if="index !== count" />
            <ArrowDown v-if="endWithArrow && index === count" />
            <div class="mt-10" v-if="readMore && index === count">
                <Button link="/articles">Read More Articles →</Button>
                <div class="mt-10 mb-6">
                    <ArrowDown />
                </div>
            </div>
        </template>
    </div>
</template>

<style scoped>
.skeleton-card {
    box-shadow:
        0 4px 10px 0 rgb(0 0 0 / 20%),
        0 4px 20px 0 rgb(0 0 0 / 19%);
}
</style>
