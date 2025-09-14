<script setup lang="ts">
interface ImageItem {
    filename: string;
    title: string;
    aspect?: "square" | "portrait" | "landscape";
}

interface Props {
    images: ImageItem[];
    currentImageSlug: string;
}

const props = defineProps<Props>();

const route = useRoute();

const galleryName = computed(() => {
    const pathParts = route.path.split("/").filter(Boolean);
    if (pathParts.length >= 3 && pathParts[0] === "through-the-lens") {
        return pathParts[1];
    }
    return "";
});

const imageWithSlugs = computed(() => {
    return props.images.map((img) => {
        const raw = img?.title?.trim();
        let slug: string;

        if (raw && raw.length) {
            slug = raw
                .toLowerCase()
                .replace(/\s+/g, "-")
                .replace(/[^a-z0-9\-]/g, "");
        } else {
            const filename = img?.filename;
            slug = filename ? filename.replace(/\.[^.]+$/, "") : "";
        }

        return {
            ...img,
            slug,
        };
    });
});

const currentIndex = computed(() => {
    return imageWithSlugs.value.findIndex((img) => img.slug === props.currentImageSlug);
});

const totalImages = computed(() => props.images.length);

const hasPrevious = computed(() => currentIndex.value > 0);
const hasNext = computed(() => currentIndex.value < totalImages.value - 1);

const previousImageUrl = computed(() => {
    if (!hasPrevious.value) return "";
    const prevImage = imageWithSlugs.value[currentIndex.value - 1];
    return prevImage ? `/through-the-lens/${galleryName.value}/${prevImage.slug}` : "";
});

const nextImageUrl = computed(() => {
    if (!hasNext.value) return "";
    const nextImage = imageWithSlugs.value[currentIndex.value + 1];
    return nextImage ? `/through-the-lens/${galleryName.value}/${nextImage.slug}` : "";
});
</script>

<template>
    <div class="flex justify-between items-center my-8 px-4 al-container">
        <Button v-if="hasPrevious" :link="previousImageUrl" classes="justify-start" :width="'width: 140px;'">
            ← Previous
        </Button>
        <div v-else class="w-[140px]"></div>

        <div class="text-center text-gray-600 text-sm">{{ currentIndex + 1 }} of {{ totalImages }}</div>

        <Button v-if="hasNext" :link="nextImageUrl" classes="justify-end" :width="'width: 140px;'"> Next → </Button>
        <div v-else class="w-[140px]"></div>
    </div>
</template>
