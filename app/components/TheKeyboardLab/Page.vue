<script setup lang="ts">
interface KeyboardSpec {
    id: number;
    title: string;
    description: string;
}

interface Props {
    keyboardSpecs?: KeyboardSpec[];
    h1Title?: string;
    description?: string;
    tags?: string;
    image?: string;
}

const route = useRoute();

const { data: page } = await useAsyncData(route.fullPath + "-keyboard-data", () => {
    return queryCollection("content").path(route.path).first();
});

const pageSlug = computed(() => {
    const segments = route.path.split("/");
    return segments[segments.length - 1];
});

const camelCaseSlug = computed(() => {
    return pageSlug.value?.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase()) || "";
});

const computedKeyboardSpecs = computed(() => {
    const specsKey = `${camelCaseSlug.value}Specs`;
    return (page.value as any)?.meta?.[specsKey] || [];
});

const computedH1Title = computed(() => {
    const titleKey = `${camelCaseSlug.value}Title`;
    return (page.value as any)?.meta?.[titleKey] || "";
});

const computedDescription = computed(() => {
    const descriptionKey = `${camelCaseSlug.value}Description`;
    return (page.value as any)?.meta?.[descriptionKey] || "";
});

const computedTags = computed(() => {
    const tagsKey = `${camelCaseSlug.value}Tags`;
    return (page.value as any)?.meta?.[tagsKey] || "";
});

const computedImage = computed(() => {
    const imageKey = `${camelCaseSlug.value}Image`;
    return (page.value as any)?.meta?.[imageKey] || "";
});

const parentPath = computed(() => {
    const pathSegments = route.path.split("/").filter((segment) => segment !== "");
    if (pathSegments.length > 1) {
        pathSegments.pop();
        return "/" + pathSegments.join("/");
    }
    return "/";
});
</script>

<template>
    <div class="text-gray text-lg break-words">
        <Button classes="my-8" :link="parentPath">← Back</Button>
        <div class="flex flex-col gap-4 lg:mx-0 lg:max-w-none lg:flex-row lg:gap-16">
            <div class="lg:flex-1 lg:max-w-2xl">
                <h1 class="text-3xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-4xl">
                    {{ computedH1Title }}
                </h1>
                <TheKeyboardLabTags :description="computedTags" />
                <p class="mt-6 text-xl/8 text-gray-600" v-html="computedDescription"></p>
                <img
                    :src="computedImage"
                    alt=""
                    class="mt-8 aspect-6/5 w-full rounded-2xl bg-gray-50 object-cover lg:aspect-auto lg:h-138"
                />
            </div>
            <div class="w-full lg:w-64 lg:flex-none mb-6">
                <h2>Keyboard Specs</h2>
                <ul class="-my-4 divide-y divide-green">
                    <li v-for="specs in computedKeyboardSpecs" :key="specs.id" class="py-4">
                        <dl class="relative flex flex-wrap gap-x-3">
                            <dt class="sr-only">Role</dt>
                            <dd class="w-full flex-none text-lg font-semibold tracking-tight text-gray-900">
                                {{ specs.title }}
                            </dd>
                            <dt class="sr-only">Description</dt>
                            <dd v-html="specs.description" class="mt-1 w-full flex-none text-base/7 text-gray-600"></dd>
                        </dl>
                    </li>
                </ul>
            </div>
        </div>
    </div>
    <hr />
</template>

<style scoped>
@reference "../../assets/css/main.css";

h1,
h2,
h3,
h4,
h5,
h6 {
    @apply font-bold my-4 text-secondary;
}

h1 {
    @apply text-4xl cursor-text;
}

h1 a {
    @apply pointer-events-none focus:outline-none;
}

h2 {
    @apply text-2xl sm:text-3xl cursor-text border-b border-green pb-1;
}

h2 a {
    @apply pointer-events-none focus:outline-none;
}

h3 {
    @apply text-xl sm:text-2xl cursor-text;
}

h3 a {
    @apply pointer-events-none focus:outline-none;
}

h4 {
    @apply text-lg sm:text-xl cursor-text;
}

h4 a {
    @apply pointer-events-none focus:outline-none;
}

h5 {
    @apply text-base sm:text-lg cursor-text;
}

h5 a {
    @apply pointer-events-none focus:outline-none;
}

h6 {
    @apply text-sm sm:text-base cursor-text;
}

h6 a {
    @apply pointer-events-none focus:outline-none;
}

p {
    @apply my-4;
}

img {
    @apply w-full rounded-md mb-6;
}

ol li {
    @apply my-2 list-decimal list-outside relative left-6 pr-6;
}

hr {
    @apply border-t border-green;
}

blockquote {
    @apply antialiased my-4 px-4 py-1 bg-green-blue text-secondary border-l-4 border-secondary rounded-md;
}

:not(h1, h2, h3, h4, h5, h6) a {
    @apply text-primary;
}

::selection {
    @apply bg-primary text-secondary;
}
</style>
