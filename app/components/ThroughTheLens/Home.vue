<script setup lang="ts">
interface PhotoCard {
    id: number;
    title: string;
    href: string;
    description: string; // comma separated tags consumed by <CardTags /> via <CardsListing />
    imageUrl: string;
}

const firstRow: PhotoCard[] = [
    {
        id: 1,
        title: "🌌 Starlit Wonders",
        href: "/through-the-lens/starlit-wonders",
        description: "cosmic-views, night-skies, galactic-dreams",
        imageUrl:
            "https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_500,e_sharpen:100/v1754697769/blog/through-the-lens/www.AleksTrpkovski.com__14_gso2hi",
    },
    {
        id: 2,
        title: "🌿 Wild Horizons",
        href: "/through-the-lens/wild-horizons",
        description: "green-escape, earth-tones, into-the-wild",
        imageUrl:
            "https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_500,e_sharpen:100/v1754698657/blog/through-the-lens/www.AleksTrpkovski.com_-_Alfred_Nicholas_Gardens_07.05.2017_wwvr1a",
    },
    {
        id: 3,
        title: "⏳ Time in Motion",
        href: "/through-the-lens/time-in-motion",
        description: "light-trails, blurred-beauty, moving-moments",
        imageUrl:
            "https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_500,e_sharpen:100/v1754698923/blog/through-the-lens/www.AleksTrpkovski.com_-_Melbourne_Train_Trails_redited_qwg20h",
    },
];

const secondRow: PhotoCard[] = [
    {
        id: 4,
        title: "🌆 Urban Glow",
        href: "/through-the-lens/urban-glow",
        description: "neon-nights, city-lights, street-frames",
        imageUrl:
            "https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_500,e_sharpen:100/v1754699122/blog/through-the-lens/www.trpkovski.com_-_the_first_day_of_winter_nokscf",
    },
    {
        id: 5,
        title: "🌊 Ocean Whispers",
        href: "/through-the-lens/ocean-whispers",
        description: "ocean-breese, coastal-views, blue-horizon",
        imageUrl:
            "https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_500,e_sharpen:100/v1754699324/blog/through-the-lens/www.AleksTrpkovski.com_-_balnarring_beach_pastel_vr8u5e",
    },
    {
        id: 6,
        title: "🏞️ Liquid Cascades",
        href: "/through-the-lens/liquid-cascades",
        description: "falling-waters, mist-and-magic, nature-flow",
        imageUrl:
            "https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_500,e_sharpen:100/v1754699393/blog/through-the-lens/www.trpkovski.com_-_phantom_falls_otway_national_park_lpai2d",
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
                <strong>Welcome to Through the Lens</strong> — a personal gallery of images I’ve taken in my free time.
                Here, you’ll find landscapes shaped by towering mountains, endless coastlines, the vibrant glow of city
                nights and the quiet magic of starry skies. Alongside each image, I share gear notes, behind-the-scenes
                stories, and the small details that turned an ordinary scene into something unforgettable. Whether
                you’re here to explore, be inspired, or simply wander through a world of captured moments, I’m glad
                you’ve found your way in.
            </p>
        </div>
        <arrow-down class="my-12"></arrow-down>
        <CardsListing :cards="firstRow" />
        <CardsListing :cards="secondRow" />
    </div>
</template>
