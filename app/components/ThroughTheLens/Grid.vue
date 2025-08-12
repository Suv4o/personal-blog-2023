<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
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

const route = useRoute();

const extraSegment = computed(() => {
    const path = route.path || "";
    if (!path.startsWith(baseGalleryPath)) return "";
    const pathParts = path.split("/").filter(Boolean);
    const baseParts = baseGalleryPath.split("/").filter(Boolean);
    if (pathParts.length <= baseParts.length) return "";
    return pathParts[pathParts.length - 1];
});

function linkFor(img: ImageItem) {
    const raw = img?.title?.trim();
    let slug: string | undefined;
    if (raw && raw.length) {
        slug = raw
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9\-]/g, "");
    }
    if (!slug || !slug.length) {
        const filename = img?.filename;
        if (!filename) return baseGalleryPath;
        slug = filename.replace(/\.[^.]+$/, "");
    }
    const prefix = extraSegment.value ? `${baseGalleryPath}/${extraSegment.value}` : baseGalleryPath;
    return `${prefix}/${slug}`;
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
                            :src="`/images/through-the-lens/${extraSegment}/${img.filename}`"
                            :alt="img.alt || img.title"
                            loading="lazy"
                            :widths="img.aspect === 'portrait' ? [320, 480, 640, 800, 900] : [320, 640, 960, 1200]"
                            class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                    </div>
                </NuxtLink>
            </div>
        </div>
    </div>
</template>
