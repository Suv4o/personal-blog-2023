<script setup lang="ts">
interface LocalImageItem {
    filename: string;
    title: string;
    alt?: string;
    aspect?: "square" | "portrait" | "landscape";
    slug?: string; // optional override
}

// Manually list images in /public/images/through-the-lens/starlit-wonders. If more are added often,
// consider creating a small server util to read the directory at build-time.
const localImages: LocalImageItem[] = [
    { filename: "aura-australia-airey-inlet-lighthouse.jpg", title: "Aireys Inlet Lighthouse", aspect: "portrait" },
    { filename: "aura-australia-airey-inlet-watching.jpg", title: "Watching the Lighthouse", aspect: "landscape" },
    { filename: "aura-australia-lorne-great-ocean-road.jpg", title: "Great Ocean Road", aspect: "landscape" },
    { filename: "aura-australia-lorne-teddys-lookout.jpg", title: "Teddy's Lookout", aspect: "portrait" },
    { filename: "camel-rock-bermagui-nsw-31-12-2021.jpg", title: "Camel Rock Bermagui", aspect: "landscape" },
    { filename: "camp-schanck-lighthouse-29-10-2017.jpg", title: "Cape Schanck Lighthouse", aspect: "portrait" },
    { filename: "cape-schanck start-trials-2023.jpg", title: "Cape Schanck Trails", aspect: "landscape" },
    { filename: "milkyway-pinacles-mpe- 06-10-2018.jpg", title: "Milky Way Pinnacles", aspect: "portrait" },
    { filename: "mount-donna-buang-yarra-ranges-national-park.jpg", title: "Mount Donna Buang", aspect: "portrait" },
    { filename: "pinnacles-western australia.jpg", title: "Pinnacles Western Australia", aspect: "landscape" },
    { filename: "pinnacles-with-mile-02-07-2017.jpg", title: "Pinnacles With Milky Way", aspect: "portrait" },
    { filename: "shipwreck-ss-speke-phillip-island-2.jpg", title: "SS Speke Shipwreck", aspect: "landscape" },
    { filename: "star-trails-big-lake-pelister-16-07-2022.jpg", title: "Star Trails", aspect: "portrait" },
    { filename: "uluru-stars.jpg", title: "Uluru Stars", aspect: "portrait" },
];

const baseGalleryPath = "/through-the-lens";

function linkFor(img: LocalImageItem) {
    const baseName = (img.slug || img.filename).replace(/\.[^.]+$/, "");
    return `${baseGalleryPath}/${baseName}`;
}

function aspectClass(img: LocalImageItem) {
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
                v-for="img in localImages"
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
