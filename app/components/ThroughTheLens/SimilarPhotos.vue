<script setup lang="ts">
interface PhotoContent {
    id: string;
    path: string;
    title: string;
    image: string;
    location?: string;
    meta?: { location?: string };
}

interface SimilarPhotosResponse {
    success: boolean;
    data: Array<{
        photoPath: string;
        imagePath: string;
        sim_image: number;
        sim_text: number;
        combined: number;
    }>;
    alpha?: number;
    requestedPath?: string | string[];
    error?: string;
}

const route = useRoute();
const relatedPhotos = ref<PhotoContent[]>([]);

const { data: allPhotos } = useAsyncData(route.fullPath + "-similar-photos-pool", () => {
    return queryCollection("content").where("type", "=", "photo").all() as Promise<PhotoContent[]>;
});

const currentPath = route.path;

const { data: similarPhotosRaw } = await useAsyncData<SimilarPhotosResponse | string>(
    route.fullPath + "-similar-photos",
    async () => {
        return await $fetch(`/api/similar-photos${currentPath}`);
    },
);

const similarPhotosData = computed<SimilarPhotosResponse | null>(() => {
    const payload = similarPhotosRaw.value;
    if (!payload) return null;
    if (typeof payload === "string") {
        try {
            return JSON.parse(payload) as SimilarPhotosResponse;
        } catch (e) {
            console.error("Failed to parse similar-photos payload", e);
            return null;
        }
    }
    return payload;
});

function processRelatedPhotos(): PhotoContent[] {
    if (!allPhotos.value?.length) return [];

    const others = allPhotos.value.filter((p) => p.path !== currentPath);
    if (!others.length) return [];

    if (similarPhotosData.value?.data?.length) {
        return similarPhotosData.value.data
            .map((item) => others.find((p) => p.path === item.photoPath))
            .filter(Boolean) as PhotoContent[];
    }

    return others.slice(0, 3);
}

watch(
    [allPhotos, similarPhotosData],
    () => {
        relatedPhotos.value = processRelatedPhotos();
    },
    { immediate: true },
);

const cards = computed(() =>
    relatedPhotos.value.map((p) => ({
        id: p.id,
        title: p.title,
        path: p.path,
        imageUrl: p.image,
        location: p.location ?? p.meta?.location ?? "",
    })),
);
</script>

<template>
    <div v-if="cards.length" class="al-container mt-12">
        <div>
            <div class="mx-auto max-w-2xl text-center">
                <h2 class="text-4xl font-semibold tracking-tight text-balance text-secondary sm:text-5xl">
                    Similar Photos
                </h2>
                <p class="mt-2 text-lg/8 text-gray-600">More moments captured through the lens.</p>
            </div>
            <div class="mx-auto mt-6 grid auto-rows-fr grid-cols-1 gap-8 sm:mt-10 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                <article
                    v-for="card in cards"
                    :key="card.id"
                    class="relative isolate flex flex-col justify-end overflow-hidden rounded-2xl bg-gray-900 px-8 pt-80 pb-8 sm:pt-48 lg:pt-80 transform transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-xl"
                >
                    <NuxtImg
                        :src="card.imageUrl"
                        :alt="card.title"
                        loading="lazy"
                        :widths="[480, 640, 960, 1200]"
                        class="absolute inset-0 -z-10 size-full object-cover transition-transform duration-300 ease-out hover:scale-105"
                    />
                    <div class="absolute inset-0 -z-10 bg-linear-to-t from-gray-900 via-gray-900/40" />
                    <div class="absolute inset-0 -z-10 rounded-2xl ring-1 ring-gray-900/10 ring-inset" />

                    <div
                        v-if="card.location"
                        class="flex flex-wrap items-center gap-y-1 overflow-hidden text-sm/6 text-white/80"
                    >
                        <span>{{ card.location }}</span>
                    </div>
                    <h3 class="mt-3 text-lg/6 font-semibold text-white">
                        <NuxtLink :to="card.path" class="transition-opacity duration-300 hover:opacity-80">
                            <span class="absolute inset-0" />
                            {{ card.title }}
                        </NuxtLink>
                    </h3>
                </article>
            </div>
        </div>
        <HorizontalRule />
    </div>
</template>
