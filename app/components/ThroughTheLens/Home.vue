<script setup lang="ts">
// Define two rows of photography collection cards (3 each)
interface PhotoCard {
    id: number;
    title: string;
    href: string;
    description: string; // comma separated tags consumed by <TheKeyboardLabTags /> via <CardsListing />
    imageUrl: string;
}

// NOTE: Using a shared placeholder image for now. Replace with specific Cloudinary assets when available.
const placeholder =
    "https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_900,e_sharpen:100/v1754654713/blog/Emoji-with-camera_bq6geb";

const firstRow: PhotoCard[] = [
    {
        id: 1,
        title: "🌌 Starlit Wonders",
        href: "/through-the-lens/starlit-wonders",
        description: "cosmic-views, night-skies, galactic-dreams",
        imageUrl: placeholder,
    },
    {
        id: 2,
        title: "🌿 Wild Horizons",
        href: "/through-the-lens/wild-horizons",
        description: "green-escape, earth-tones, into-the-wild",
        imageUrl: placeholder,
    },
    {
        id: 3,
        title: "⏳ Time in Motion",
        href: "/through-the-lens/time-in-motion",
        description: "light-trails, blurred-beauty, moving-moments",
        imageUrl: placeholder,
    },
];

const secondRow: PhotoCard[] = [
    {
        id: 4,
        title: "🌆 Urban Glow",
        href: "/through-the-lens/urban-glow",
        description: "neon-nights, city-lights, street-frames",
        imageUrl: placeholder,
    },
    {
        id: 5,
        title: "🌊 Ocean Whispers",
        href: "/through-the-lens/ocean-whispers",
        description: "ocean-breese, coastal-views, blue-horizon",
        imageUrl: placeholder,
    },
    {
        id: 6,
        title: "🏞️ Liquid Cascades",
        href: "/through-the-lens/liquid-cascades",
        description: "falling-waters, mist-and-magic, nature-flow",
        imageUrl: placeholder,
    },
];
</script>

<template>
    <div>
        <div class="text-2xl sm:text-4xl text-center text-secondary mt-12 mb-6"><strong>THROUGH THE LENS</strong></div>
        <arrow-down class=""></arrow-down>
        <div class="flex justify-center">
            <img
                src="https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_1200,e_sharpen:100/v1754654713/blog/Emoji-with-camera_bq6geb"
                alt="Aleks landscape photography hero"
                class="w-full rounded-md max-w-[700px]"
            />
        </div>
        <arrow-down class="mt-12"></arrow-down>
        <div class="flex justify-center mt-12">
            <p class="text-gray text-center text-lg sm:text-xl">
                <strong>Welcome to Through the Lens</strong> — my personal gallery of moments where nature, light, and
                story meet. Here, you’ll find landscapes shaped by towering mountains, endless coastlines, the vibrant
                glow of city nights and the quiet magic of starry skies. Alongside each image, I share gear notes,
                behind-the-scenes stories, and the small details that turned an ordinary scene into something
                unforgettable. Whether you’re here to explore, be inspired, or simply wander through a world of captured
                moments, I’m glad you’ve found your way in.
            </p>
        </div>
        <arrow-down class="my-12"></arrow-down>
        <!-- Two rows of CardsListing with photography themed collections -->
        <CardsListing :cards="firstRow" />
        <CardsListing :cards="secondRow" />
    </div>
</template>
