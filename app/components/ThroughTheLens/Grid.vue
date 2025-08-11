<script setup lang="ts">
import { computed } from "vue";
interface ImageItem {
    filename: string;
    title: string;
    alt?: string;
    aspect?: "square" | "portrait" | "landscape";
    slug?: string;
}

const props = defineProps<{ images?: ImageItem[] }>();

const images = computed<ImageItem[]>(() => {
    if (!Array.isArray(props.images)) return [];
    return props.images.filter((img) => img && (img.slug || img.filename));
});

const baseGalleryPath = "/through-the-lens";

function linkFor(img: ImageItem) {
    const source = img?.slug || img?.filename;
    if (!source) return baseGalleryPath;
    const baseName = source.replace(/\.[^.]+$/, "");
    return `${baseGalleryPath}/${baseName}`;
}

function aspectClass(img: ImageItem) {
    switch (img.aspect) {
        case "portrait":
            return "aspect-[3/4]";
        case "landscape":
            return "aspect-[4/3]";
        case "square":
            return "aspect-square";
        default:
            return "aspect-[4/3]";
    }
}
</script>

<template>
    <div class="w-full">
        <div class="masonry columns-1 sm:columns-2 lg:columns-3 xl:columns-3 gap-4">
            <div
                v-for="img in images"
                :key="img.filename"
                class="mb-4 break-inside-avoid group relative cursor-pointer overflow-hidden rounded-md shadow-sm ring-1 ring-black/5"
            >
                <NuxtLink :to="linkFor(img)" class="block h-full w-full">
                    <div
                        class="w-full overflow-hidden bg-green-blue/40 flex items-center justify-center"
                        :class="aspectClass(img)"
                    >
                        <NuxtImg
                            :src="`/images/through-the-lens/starlit-wonders/${img.filename}`"
                            :alt="img.alt || img.title"
                            loading="lazy"
                            :widths="img.aspect === 'portrait' ? [320, 480, 640, 800, 900] : [320, 640, 960, 1200]"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                    </div>
                </NuxtLink>
            </div>
        </div>
    </div>
</template>
