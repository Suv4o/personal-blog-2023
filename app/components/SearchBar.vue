<script setup lang="ts">
import { ref } from "vue";
import { MagnifyingGlassIcon } from "@heroicons/vue/20/solid";

const router = useRouter();
const query = ref("");

function submit() {
    const q = query.value.trim();
    if (!q) return;
    router.push({ path: "/search", query: { q } });
}
</script>

<template>
    <form
        class="relative w-full"
        @submit.prevent="submit"
        toolname="search_site"
        tooldescription="Semantic search across articles, photos, and keyboards on the Trpkovski tech blog"
    >
        <label for="site-search" class="sr-only">Search</label>
        <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MagnifyingGlassIcon class="h-5 w-5 text-gray" aria-hidden="true" />
        </div>
        <input
            id="site-search"
            v-model="query"
            type="search"
            name="q"
            placeholder="Search"
            class="block w-full rounded-md border-2 border-transparent py-1.5 pl-10 pr-3 text-gray placeholder:text-gray focus:border-primary focus:ring-0 focus:outline-none sm:text-lg sm:leading-6"
        />
    </form>
</template>
