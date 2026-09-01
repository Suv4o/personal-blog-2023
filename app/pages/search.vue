<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import type { SearchKind, SearchResult } from "~/types";

definePageMeta({ layout: "default" });

const route = useRoute();
const config = useRuntimeConfig();
const isDev = computed(() => Boolean(config.public.isDev));

const query = computed(() => (typeof route.query.q === "string" ? route.query.q : ""));
const results = ref<SearchResult[]>([]);
const status = ref<"idle" | "loading" | "ready" | "error">("idle");
const progressMessage = ref("");
const errorMessage = ref("");
const consentChoice = ref<"unknown" | "accepted" | "declined">("unknown");
const mode = ref<"semantic" | "keyword">("semantic");

const search = useSemanticSearch();

const grouped = computed(() => {
    const byKind: Record<SearchKind, SearchResult[]> = { article: [], photo: [], keyboard: [], page: [] };
    for (const r of results.value) byKind[r.kind].push(r);
    return byKind;
});

const groupOrder: { kind: SearchKind; label: string }[] = [
    { kind: "article", label: "Articles" },
    { kind: "photo", label: "Photos" },
    { kind: "keyboard", label: "Keyboards" },
    { kind: "page", label: "About" },
];

async function runSearch() {
    const q = query.value.trim();
    if (!q) {
        results.value = [];
        status.value = "idle";
        return;
    }
    status.value = "loading";
    progressMessage.value = "";
    errorMessage.value = "";
    try {
        if (mode.value === "semantic" && consentChoice.value === "accepted") {
            results.value = await search.searchSemantic(q, (m) => (progressMessage.value = m));
        } else {
            results.value = await search.searchKeyword(q);
        }
        status.value = "ready";
    } catch (err) {
        errorMessage.value = (err as Error).message;
        status.value = "error";
        try {
            results.value = await search.searchKeyword(q);
            status.value = "ready";
            mode.value = "keyword";
        } catch {
            results.value = [];
        }
    }
}

function handleAccept() {
    search.setConsent("accepted");
    consentChoice.value = "accepted";
    mode.value = "semantic";
    runSearch();
}

function handleDecline() {
    search.setConsent("declined");
    consentChoice.value = "declined";
    mode.value = "keyword";
    runSearch();
}

onMounted(() => {
    consentChoice.value = search.consent();
    mode.value = consentChoice.value === "accepted" ? "semantic" : "keyword";
    if (consentChoice.value !== "unknown") {
        runSearch();
    }
});

watch(query, () => {
    if (consentChoice.value !== "unknown") runSearch();
});
</script>

<template>
    <main class="container mx-auto px-4 py-8 max-w-3xl">
        <h1 class="text-3xl text-secondary mb-2">
            Search results for <span class="text-primary">"{{ query }}"</span>
        </h1>
        <p v-if="mode === 'keyword' && consentChoice === 'declined'" class="text-sm text-secondary mb-6">
            Keyword search (semantic search disabled).
            <button class="underline cursor-pointer" @click="handleAccept">Enable semantic search</button>
        </p>
        <p v-else-if="mode === 'keyword' && consentChoice === 'accepted'" class="text-sm text-secondary mb-6">
            Fell back to keyword search due to a model error.
        </p>
        <p v-else class="text-sm text-secondary mb-6">Semantic search powered by on-device AI.</p>

        <SearchConsentModal v-if="consentChoice === 'unknown' && query" @accept="handleAccept" @decline="handleDecline" />

        <div v-if="status === 'loading'" class="text-secondary py-8">
            <div class="animate-pulse">Searching…</div>
            <p v-if="progressMessage" class="text-sm mt-2">{{ progressMessage }}</p>
        </div>

        <div v-else-if="status === 'ready' && results.length === 0 && query" class="text-secondary py-8">
            <p>No confident matches. Try a different phrase.</p>
            <NuxtLink to="/articles" class="text-primary underline">Browse all articles</NuxtLink>
        </div>

        <div v-else-if="status === 'ready'">
            <section v-for="g in groupOrder" :key="g.kind" v-show="grouped[g.kind].length > 0" class="mb-10">
                <h2 class="text-2xl text-secondary mb-4">
                    <strong>{{ g.label }}</strong>
                </h2>
                <ul class="space-y-6">
                    <li v-for="r in grouped[g.kind]" :key="r.id">
                        <NuxtLink
                            :to="r.path"
                            class="block bg-beige border-2 border-white rounded-md p-4 text-secondary shadow-[10px_10px] shadow-beige hover:shadow-[5px_5px] transition-shadow"
                        >
                            <div class="flex gap-4">
                                <div v-if="r.image" class="flex-shrink-0 w-24 h-24 sm:w-32 sm:h-32 overflow-hidden rounded-md">
                                    <img :src="r.image" :alt="r.title" class="w-full h-full object-cover" />
                                </div>
                                <div class="flex-1 min-w-0">
                                    <h3 class="text-lg sm:text-xl font-medium leading-snug">
                                        {{ r.title }}
                                        <span v-if="isDev" class="text-xs text-gray ml-2">score={{ r.score.toFixed(3) }}</span>
                                    </h3>
                                    <p v-if="r.description" class="text-sm sm:text-base mt-2 line-clamp-3">
                                        {{ r.description }}
                                    </p>
                                </div>
                            </div>
                        </NuxtLink>
                    </li>
                </ul>
            </section>
        </div>

        <div v-else-if="status === 'error'" class="text-secondary py-8">
            <p>Something went wrong: {{ errorMessage }}</p>
        </div>
    </main>
</template>

<style scoped>
.line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>
