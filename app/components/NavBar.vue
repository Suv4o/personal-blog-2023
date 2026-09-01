<script setup lang="ts">
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import { Bars3Icon, XMarkIcon } from "@heroicons/vue/24/outline";
import { computed, ref } from "vue";
const route = useRoute();

const mobileToggle = ref<any>(null);

const hasArticlesPath = computed(() => {
    return route.path.startsWith("/articles") || /\/\d{4}\/\d{2}\/\d{2}\//.test(route.path);
});
const hasKeyboardLabPath = computed(() => route.path.includes("/the-keyboard-lab"));
const hasThroughTheLensPath = computed(() => route.path.includes("/through-the-lens"));
const hasAboutMePath = computed(() => route.path.startsWith("/about-me"));

function closeMobileMenu() {
    const btn = (mobileToggle.value as ComponentPublicInstance)?.$el ?? mobileToggle.value;
    if (btn && typeof btn.click === "function") btn.click();
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
                        <div class="flex space-x-4" :key="route.fullPath">
                            <NuxtLink
                                to="/articles"
                                key="/articles"
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
                                to="/through-the-lens"
                                class="px-3 py-2 text-lg font-medium text-white relative hover:before:absolute hover:before:bottom-0 before:right-0 before:h-0.5 before:bg-primary before:w-full focus:outline-none focus:before:absolute focus:before:bottom-0"
                                :class="{ 'router-link-active': hasThroughTheLensPath }"
                                >Through The Lens</NuxtLink
                            >
                            <NuxtLink
                                to="/about-me"
                                class="px-3 py-2 text-lg font-medium text-white relative hover:before:absolute hover:before:bottom-0 before:right-0 before:h-0.5 before:bg-primary before:w-full focus:outline-none focus:before:absolute focus:before:bottom-0"
                                :class="{ 'router-link-active': hasAboutMePath }"
                                >About Me</NuxtLink
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
                        <SearchBar />
                    </div>
                </div>
                <div class="flex lg:hidden overflow-x-hidden">
                    <!-- Mobile menu button -->
                    <DisclosureButton
                        ref="mobileToggle"
                        class="relative inline-flex items-center justify-center rounded-md p-2 text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white cursor-pointer"
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
            <div class="space-y-1 px-2 pb-3 pt-2" :key="route.fullPath">
                <NuxtLink
                    to="/articles"
                    @click="closeMobileMenu"
                    class="block cursor-pointer text-lg font-medium text-white px-3 py-2 relative hover:before:absolute hover:before:bottom-0 before:right-0 before:h-0.5 before:bg-primary before:w-full focus:outline-none focus:before:absolute focus:before:bottom-0"
                    :class="{ 'router-link-active': hasArticlesPath }"
                >
                    Articles
                </NuxtLink>
                <NuxtLink
                    to="/the-keyboard-lab"
                    @click="closeMobileMenu"
                    class="block cursor-pointer text-lg font-medium text-white px-3 py-2 relative hover:before:absolute hover:before:bottom-0 before:right-0 before:h-0.5 before:bg-primary before:w-full focus:outline-none focus:before:absolute focus:before:bottom-0"
                    :class="{ 'router-link-active': hasKeyboardLabPath }"
                >
                    The Keyboard Lab
                </NuxtLink>
                <NuxtLink
                    to="/through-the-lens"
                    @click="closeMobileMenu"
                    class="block cursor-pointer text-lg font-medium text-white px-3 py-2 relative hover:before:absolute hover:before:bottom-0 before:right-0 before:h-0.5 before:bg-primary before:w-full focus:outline-none focus:before:absolute focus:before:bottom-0"
                    :class="{ 'router-link-active': hasThroughTheLensPath }"
                >
                    Through The Lens
                </NuxtLink>
                <NuxtLink
                    to="/about-me"
                    @click="closeMobileMenu"
                    class="block cursor-pointer text-lg font-medium text-white px-3 py-2 relative hover:before:absolute hover:before:bottom-0 before:right-0 before:h-0.5 before:bg-primary before:w-full focus:outline-none focus:before:absolute focus:before:bottom-0"
                    :class="{ 'router-link-active': hasAboutMePath }"
                >
                    About Me
                </NuxtLink>
                <NuxtLink
                    to="/get-in-touch"
                    @click="closeMobileMenu"
                    class="block cursor-pointer text-lg font-medium text-white px-3 py-2 relative hover:before:absolute hover:before:bottom-0 before:right-0 before:h-0.5 before:bg-primary before:w-full focus:outline-none focus:before:absolute focus:before:bottom-0"
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
