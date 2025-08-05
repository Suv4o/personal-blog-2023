<script setup lang="ts">
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import { MagnifyingGlassIcon } from "@heroicons/vue/20/solid";
import { Bars3Icon, XMarkIcon } from "@heroicons/vue/24/outline";
import { computed, ref } from "vue";
import { Combobox, ComboboxInput, ComboboxLabel, ComboboxOption, ComboboxOptions } from "@headlessui/vue";
import type { Article } from "~/types";
const router = useRouter();
const route = useRoute();

const articles = ref();
const query = ref("");
const selectedArticle = ref<Article>();

const hasArticlesPath = computed(() => {
    return route.path.includes("/articles/") || /\/\d{4}\/\d{2}\/\d{2}\//.test(route.path);
});
const hasKeyboardLabPath = computed(() => route.path.includes("/the-keyboard-lab"));

watch(
    () => selectedArticle.value,
    () => {
        navigateToArticle();
    }
);

async function getArticles() {
    const { data } = await useAsyncData(route.fullPath + "-nav", () => {
        return queryCollection("content").where("blog", "=", "post").all();
    });
    return data.value ?? [];
}

articles.value = await getArticles();

const filteredArticles = computed(() =>
    query.value === ""
        ? articles.value
        : articles.value.filter((article: Article) => {
              return article.title.toLowerCase().includes(query.value.toLowerCase());
          })
);

async function navigateToArticle() {
    await nextTick();
    if (!filteredArticles.value.length) {
        return;
    }

    if (!selectedArticle.value) {
        return;
    }

    router.push(selectedArticle.value.path);
}
</script>

<template>
    <Disclosure as="nav" class="bg-secondary" v-slot="{ open }">
        <div class="lg:px-2">
            <div class="relative flex h-16 items-center justify-between">
                <div class="flex items-center px-2 lg:px-0">
                    <div class="flex-shrink-0">
                        <NuxtLink to="/" class="logo focus:outline-none">
                            <img class="h-11 w-auto" src="/favicon.png" alt="Aleks Trpkovski Personal Blog Logo" />
                        </NuxtLink>
                    </div>
                    <div class="hidden lg:ml-6 lg:block">
                        <div class="flex space-x-4">
                            <NuxtLink
                                to="/articles"
                                class="px-3 py-2 text-lg font-medium text-white relative hover:before:absolute hover:before:bottom-0 before:right-0 before:h-0.5 before:bg-primary before:w-full focus:outline-none focus:before:absolute focus:before:bottom-0"
                                :class="{ 'router-link-active': hasArticlesPath }"
                                >Articles</NuxtLink
                            >
                            <NuxtLink
                                to="/the-keyboard-lab"
                                class="px-3 py-2 text-lg font-medium text-white relative hover:before:absolute hover:before:bottom-0 before:right-0 before:h-0.5 before:bg-primary before:w-full focus:outline-none focus:before:absolute focus:before:bottom-0"
                                :class="{ 'router-link-active': hasKeyboardLabPath }"
                                >The Keyboard Lab</NuxtLink
                            >
                            <NuxtLink
                                to="/get-in-touch"
                                class="px-3 py-2 text-lg font-medium text-white relative hover:before:absolute hover:before:bottom-0 before:right-0 before:h-0.5 before:bg-primary before:w-full focus:outline-none focus:before:absolute focus:before:bottom-0"
                                >Get In Touch</NuxtLink
                            >
                        </div>
                    </div>
                </div>
                <div class="flex flex-1 justify-center px-2 lg:ml-6 lg:justify-end">
                    <div class="w-full max-w-lg lg:max-w-xs">
                        <Combobox as="div" v-model="selectedArticle">
                            <ComboboxLabel class="sr-only">Search</ComboboxLabel>
                            <div class="relative">
                                <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <MagnifyingGlassIcon class="h-5 w-5 text-gray" aria-hidden="true" />
                                </div>
                                <ComboboxInput
                                    class="block w-full rounded-md border-2 border-transparent py-1.5 pl-10 pr-3 text-gray placeholder:text-gray focus:ring-0 sm:text-lg sm:leading-6 focus:border-primary"
                                    @change="query = $event.target.value"
                                    placeholder="Search"
                                    type="search"
                                />

                                <ComboboxOptions
                                    v-if="filteredArticles.length > 0"
                                    class="search_results absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-beige py-1 shadow-lg ring-1 ring-primary ring-opacity-5 focus:outline-none sm:text-lg border border-secondary"
                                >
                                    <ComboboxOption
                                        v-for="article in filteredArticles"
                                        :key="article.path"
                                        :value="article"
                                        as="template"
                                        v-slot="{ active }"
                                    >
                                        <NuxtLink :to="article.path">
                                            <li
                                                :class="[
                                                    'relative cursor-pointer select-none py-2 pl-3 pr-9',
                                                    active ? 'bg-secondary text-primary' : 'text-secondary',
                                                ]"
                                            >
                                                <span :class="['block truncate']">
                                                    {{ article.title }}
                                                </span>
                                            </li>
                                        </NuxtLink>
                                    </ComboboxOption>
                                </ComboboxOptions>
                            </div>
                        </Combobox>
                    </div>
                </div>
                <div class="flex lg:hidden overflow-x-hidden">
                    <!-- Mobile menu button -->
                    <DisclosureButton
                        class="relative inline-flex items-center justify-center rounded-md p-2 text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                    >
                        <span class="absolute -inset-0.5" />
                        <span class="sr-only">Open main menu</span>
                        <Bars3Icon v-if="!open" class="block h-6 w-6 text-white" aria-hidden="true" />
                        <XMarkIcon v-else class="block h-6 w-6 text-white" aria-hidden="true" />
                    </DisclosureButton>
                </div>
            </div>
        </div>

        <DisclosurePanel class="lg:hidden">
            <div class="space-y-1 px-2 pb-3 pt-2">
                <NuxtLink
                    to="/articles"
                    class="block text-lg font-medium text-white px-3 py-2 relative hover:before:absolute hover:before:bottom-0 before:right-0 before:h-0.5 before:bg-primary before:w-full focus:outline-none focus:before:absolute focus:before:bottom-0"
                >
                    Articles
                </NuxtLink>
                <NuxtLink
                    to="/the-keyboard-lab"
                    class="block text-lg font-medium text-white px-3 py-2 relative hover:before:absolute hover:before:bottom-0 before:right-0 before:h-0.5 before:bg-primary before:w-full focus:outline-none focus:before:absolute focus:before:bottom-0"
                >
                    The Keyboard Lab
                </NuxtLink>
                <NuxtLink
                    to="/get-in-touch"
                    class="block text-lg font-medium text-white px-3 py-2 relative hover:before:absolute hover:before:bottom-0 before:right-0 before:h-0.5 before:bg-primary before:w-full focus:outline-none focus:before:absolute focus:before:bottom-0"
                >
                    Get In Touch
                </NuxtLink>
            </div>
        </DisclosurePanel>
    </Disclosure>
</template>

<style scoped>
@reference "../assets/css/main.css";

.router-link-active {
    @apply before:absolute before:bottom-0 before:right-0 before:h-0.5 before:bg-primary before:w-full;
}

.search_results .router-link-active {
    @apply before:absolute before:bottom-0 before:right-0 before:h-0 before:w-0;
}

.logo.router-link-active {
    @apply before:absolute before:bottom-0 before:right-0 before:h-0 before:w-0;
}
</style>
