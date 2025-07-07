<script setup lang="ts">
interface Props {
    description: string;
}

const props = defineProps<Props>();

// Parse comma-separated description into individual tags
const parsedTags = computed(() => {
    return props.description.split(",").map((tag) => tag.trim());
});

// Define color mappings for different tag types
const getTagColor = (tag: string): string => {
    const tagLower = tag.toLowerCase();

    // Color mappings based on your existing Tailwind custom colors
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

        // Default fallback colors using your custom palette
        "default-1": "bg-green-light text-secondary",
        "default-2": "bg-primary-light text-white",
        "default-3": "bg-tech text-white",
        "default-4": "bg-entertainment text-secondary",
    };

    // Check for exact matches first
    if (colorMap[tagLower]) {
        return colorMap[tagLower];
    }

    // Fallback to cycling through default colors based on tag length
    const defaultColors = ["default-1", "default-2", "default-3", "default-4"];
    const colorIndex = tag.length % defaultColors.length;
    return colorMap[defaultColors[colorIndex]];
};
</script>

<template>
    <div class="keyboard-tags flex flex-wrap">
        <span
            v-for="(tag, index) in parsedTags"
            :key="index"
            :class="['inline-block px-3 py-1 rounded-full text-xs font-medium mr-2 mb-2', getTagColor(tag)]"
        >
            {{ tag }}
        </span>
    </div>
</template>
