<script setup lang="ts">
const titleRef = ref();
const dateRef = ref();
const tagsRef = ref();
const contentBlockRef = ref();
const descriptionRef = ref();
const lineClamp = ref();
const route = useRoute();
const { isClient } = useHelpers();

defineProps({
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
    totalPages: {
        type: Number,
        default: 0,
    },
});

onMounted(async () => {
    addResizeListener();
    setLineClamp();
});

onBeforeUnmount(() => {
    removeResizeListener();
});

function addResizeListener() {
    window.addEventListener("resize", setLineClamp);
}

function removeResizeListener() {
    window.removeEventListener("resize", setLineClamp);
}

function setLineClamp() {
    const numLines = getNumberOfForDescriptionLines();
    lineClamp.value = `line-clamp-[${numLines}]`;
}

function getHeightOfTheContentBlock() {
    return contentBlockRef.value.offsetHeight;
}

function getHeightOfTitle() {
    return titleRef.value.offsetHeight;
}

function getHeightOfDate() {
    return dateRef.value.offsetHeight;
}

function getHeightOfTags() {
    return tagsRef.value.offsetHeight;
}

function getNumberOfForDescriptionLines() {
    const descriptionHeight = getHeightOfTheContentBlock() - getHeightOfTitle() - getHeightOfDate() - getHeightOfTags();
    const lineHeight = parseInt(getComputedStyle(descriptionRef.value).lineHeight) + 28;
    const numRows = Math.ceil(descriptionHeight / lineHeight);
    return numRows;
}

const basePath = computed(() => {
    let routePath = route.path;
    if (routePath.endsWith("/")) {
        routePath = routePath.slice(0, -1);
    }
    const basePath = routePath.split("/").slice(0, -1).join("/");
    if (routePath.match(/\/\d+$/)) {
        return `${basePath}`;
    }
    return routePath;
});
</script>

<template>
    <ClientOnly>
        <ArrowDown v-if="startWithArrow && index === 0" />
    </ClientOnly>
    <NuxtLink
        :to="url"
        class="block w-full h-80 bg-beige rounded-md my-9 lg:hover:scale-105 lg:focus:scale-105 focus:outline-none transition-transform duration-300 ease-in-out card_shadow overflow-hidden"
    >
        <div class="sm:flex">
            <div
                class="hidden sm:block sm:w-6/12 h-80 bg-cover bg-center no-repeat"
                :style="{
                    backgroundImage: `url(${image})`,
                }"
            ></div>
            <div class="w-full sm:w-7/12 h-80 px-4 sm:px-10 py-4 flex flex-col justify-center" ref="contentBlockRef">
                <h2 class="text-secondary font-bold text-2xl" ref="titleRef">{{ title }}</h2>
                <p class="text-secondary font-light italic text-base" ref="dateRef">{{ date }}</p>
                <div class="my-2" ref="tagsRef">
                    <TagPills small :tags="tags" />
                </div>
                <p class="text-base text-gray" :class="lineClamp" ref="descriptionRef">{{ description }}</p>
            </div>
        </div>
    </NuxtLink>
    <ClientOnly>
        <ArrowDown v-if="index !== length - 1" />
    </ClientOnly>
    <ClientOnly>
        <ArrowDown v-if="endWithArrow && index === length - 1" />
    </ClientOnly>
    <div class="mt-10" v-if="readMore && index === length - 1">
        <Button link="/articles">Read More Articles →</Button>
        <ClientOnly>
            <div class="mt-10 mb-6">
                <ArrowDown />
            </div>
        </ClientOnly>
    </div>
    <div v-show="pagination && index === length - 1 && isClient">
        <div class="flex justify-center items-center gap-2 sm:gap-4">
            <div class="flex-1 flex justify-start">
                <div v-if="hasPreviousPage" class="w-[130px]">
                    <Button :link="`${basePath}/${pageNumber - 1}`" classes="w-full"> ← Previous </Button>
                </div>
            </div>

            <div v-if="totalPages > 1" class="text-center text-sm sm:text-base text-gray whitespace-nowrap">
                {{ pageNumber }} of {{ totalPages }}
            </div>

            <div class="flex-1 flex justify-end">
                <div v-if="hasNextPage">
                    <Button :link="`${basePath}/${pageNumber + 1}`" classes="w-full"> Next → </Button>
                </div>
            </div>
        </div>
        <div class="mt-6 mb-6">
            <ArrowDown />
        </div>
        <HorizontalRule />
    </div>
</template>

<style scoped>
.card_shadow {
    box-shadow:
        0 4px 10px 0 rgb(0 0 0 / 20%),
        0 4px 20px 0 rgb(0 0 0 / 19%);
}
</style>
