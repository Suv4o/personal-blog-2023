<script setup lang="ts">
interface Props {
    description: string;
}

const props = defineProps<Props>();

// Parse comma-separated description into individual tags
const parsedTags = computed(() => props.description.split(",").map((tag) => tag.trim()));

// Shared color mappings across keyboard + photography tags
const getTagColor = (tag: string): string => {
    const tagLower = tag.toLowerCase();
    const colorMap: Record<string, string> = {
        // Style/aesthetic tags
        cute: "bg-primary text-white",
        dreamy: "bg-green-blue text-secondary",
        pastel: "bg-beige text-gray",
        minimal: "bg-gray text-white",
        retro: "bg-backend text-white",
        "soft-retro": "bg-beige-light text-gray",
        vintage: "bg-secondary text-white",
        edgy: "bg-secondary-light text-white",
        cool: "bg-green text-white",
        warm: "bg-mustard text-secondary",

        // Nature/theme tags
        "cat-inspired": "bg-hobby text-white",
        creamy: "bg-entertainment text-black",
        sunny: "bg-javascript text-secondary",
        "sci-fi": "bg-ai text-secondary",

        // Default fallback colors using custom palette
        "default-1": "bg-green-light text-secondary",
        "default-2": "bg-primary-light text-white",
        "default-3": "bg-tech text-white",
        "default-4": "bg-entertainment text-secondary",

        // Through The Lens specific photography collection tags
        "cosmic-views": "bg-cosmic-views text-white",
        "night-skies": "bg-night-skies text-white",
        "galactic-dreams": "bg-galactic-dreams text-white",
        "green-escape": "bg-green-escape text-white",
        "earth-tones": "bg-earth-tones text-white",
        "into-the-wild": "bg-into-the-wild text-white",
        "light-trails": "bg-light-trails text-secondary",
        "blurred-beauty": "bg-blurred-beauty text-secondary",
        "moving-moments": "bg-moving-moments text-white",
        "neon-nights": "bg-neon-nights text-white",
        "city-lights": "bg-city-lights text-white",
        "street-frames": "bg-street-frames text-white",
        "ocean-breese": "bg-ocean-breese text-secondary",
        "coastal-views": "bg-coastal-views text-white",
        "blue-horizon": "bg-blue-horizon text-white",
        "falling-waters": "bg-falling-waters text-secondary",
        "mist-and-magic": "bg-mist-and-magic text-secondary",
        "nature-flow": "bg-nature-flow text-white",
    };

    if (colorMap[tagLower]) return colorMap[tagLower];

    const defaults = ["default-1", "default-2", "default-3", "default-4"];
    const idx = tag.length % defaults.length;
    const picked = defaults[idx]!;
    return colorMap[picked] ?? "bg-green-light text-secondary";
};
</script>

<template>
    <div class="card-tags flex flex-wrap">
        <span
            v-for="(tag, index) in parsedTags"
            :key="index"
            :class="['inline-block px-3 py-1 rounded-full text-xs font-medium mr-2 mb-2', getTagColor(tag)]"
        >
            {{ tag }}
        </span>
    </div>
</template>
