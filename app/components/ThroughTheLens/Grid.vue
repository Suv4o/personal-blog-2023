<script setup lang="ts">
interface ImageItem {
    slug: string;
    src: string;
    title: string;
    alt?: string;
    aspect?: "square" | "portrait" | "landscape";
}

const props = defineProps<{ images?: ImageItem[]; basePath?: string }>();

const defaultImages: ImageItem[] = [
    {
        slug: "liquid-cascades",
        src: "https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_800/blog/through-the-lens/www.trpkovski.com_-_phantom_falls_otway_national_park_lpai2d",
        title: "Liquid Cascades",
        aspect: "portrait",
    },
    {
        slug: "ocean-whispers",
        src: "https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_800/blog/through-the-lens/www.AleksTrpkovski.com_-_balnarring_beach_pastel_vr8u5e",
        title: "Ocean Whispers",
        aspect: "landscape",
    },
    {
        slug: "starlit-wonders",
        src: "https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_800/blog/through-the-lens/www.AleksTrpkovski.com__14_gso2hi",
        title: "Starlit Wonders",
        aspect: "portrait",
    },
    {
        slug: "time-in-motion",
        src: "https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_800/blog/through-the-lens/www.AleksTrpkovski.com_-_Melbourne_Train_Trails_redited_qwg20h",
        title: "Time in Motion",
        aspect: "landscape",
    },
    {
        slug: "urban-glow",
        src: "https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_800/blog/through-the-lens/www.trpkovski.com_-_the_first_day_of_winter_nokscf",
        title: "Urban Glow",
        aspect: "portrait",
    },
    {
        slug: "wild-horizons",
        src: "https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_800/blog/through-the-lens/www.AleksTrpkovski.com_-_Alfred_Nicholas_Gardens_07.05.2017_wwvr1a",
        title: "Wild Horizons",
        aspect: "portrait",
    },
];

const allImages = computed(() => (props.images?.length ? props.images : defaultImages));
const basePath = computed(() => (props.basePath ? props.basePath.replace(/\/$/, "") : "/through-the-lens"));

function linkFor(img: ImageItem) {
    return `${basePath.value}/${img.slug}`;
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
    <div class="through-the-lens-grid w-full">
        <div class="masonry columns-1 sm:columns-2 lg:columns-3 xl:columns-3 gap-4">
            <div
                v-for="img in allImages"
                :key="img.slug"
                class="mb-4 break-inside-avoid group relative cursor-pointer overflow-hidden rounded-md shadow-sm ring-1 ring-black/5"
            >
                <NuxtLink :to="linkFor(img)" class="block h-full w-full">
                    <div
                        class="w-full overflow-hidden bg-green-blue/40 flex items-center justify-center"
                        :class="aspectClass(img)"
                    >
                        <img
                            :src="img.src"
                            :alt="img.alt || img.title"
                            loading="lazy"
                            class="h-full w-full object-cover"
                        />
                    </div>
                </NuxtLink>
            </div>
        </div>
    </div>
</template>
