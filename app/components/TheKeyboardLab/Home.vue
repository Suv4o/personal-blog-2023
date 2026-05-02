<script setup lang="ts">
const keyboards = [
    {
        id: 1,
        title: "🐾 Pastel Paws",
        href: "/the-keyboard-lab/pastel-paws",
        description: "cute, dreamy, pastel, cat-inspired",
        imageUrl:
            "https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_500,e_sharpen:100/v1754297235/blog/the-keyboard-lab/Pastel_Paws_yuyysg",
    },
    {
        id: 2,
        title: "🍋 Lemon Milk",
        href: "/the-keyboard-lab/lemon-milk",
        description: "refreshing, warm, creamy, sunny",
        imageUrl:
            "https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_500,e_sharpen:100/v1754209966/blog/the-keyboard-lab/keyboard-2_r8ujln",
    },
    {
        id: 3,
        title: "🕹️ Retrograde",
        href: "/the-keyboard-lab/retrograde",
        description: "sci-fi meets vintage, minimal, retro",
        imageUrl:
            "https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_500,e_sharpen:100/v1754297235/blog/the-keyboard-lab/Retrograde_lfxjf3",
    },
    {
        id: 4,
        title: "🍡 Bubblegum",
        href: "/the-keyboard-lab/bubblegum",
        description: "playful, pastel, sweet, dreamy",
        imageUrl:
            "https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_500,e_sharpen:100/v1777637128/blog/the-keyboard-lab/image-1_lv9lf7.jpg",
    },
    {
        id: 5,
        title: "🌊 Shoreline",
        href: "/the-keyboard-lab/shoreline",
        description: "nautical, bold, coastal, classic",
        imageUrl:
            "https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_500,e_sharpen:100/v1777637182/blog/the-keyboard-lab/_DSC5608_evraeg.jpg",
    },
];
</script>

<template>
    <div>
        <div class="text-2xl sm:text-4xl text-center text-secondary mt-12 mb-6"><strong>THE KEYBOARD LAB</strong></div>
        <arrow-down class="mb-6"></arrow-down>
        <div class="flex justify-center mt-6">
            <img
                src="https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_1200,e_sharpen:100/v1751774465/blog/Emoji_-_Aleks_with_Keyboard_xo5zyy"
                alt="Aleks emoji holding keyboard"
                class="w-full rounded-md max-w-[700px]"
            />
        </div>
        <arrow-down class="mt-12"></arrow-down>
        <div class="flex justify-center mt-12">
            <p class="text-gray text-center text-lg sm:text-xl">
                <strong>Welcome to The Keyboard Lab</strong> — a dedicated corner of my blog where I showcase some of my
                favorite custom mechanical keyboards. I’ve built this space to document not just the boards themselves,
                but also the details that make each one unique, from the switches and keycaps to the mods and layouts.
                You’ll find build specs, personal notes on why I chose certain components, and insights that might help
                you on your own mechanical keyboard journey. Whether you’re just getting into the hobby or already deep
                in the rabbit hole, I hope this page sparks some inspiration.
            </p>
        </div>
        <arrow-down class="my-12"></arrow-down>
        <CardsListing :cards="keyboards" />
    </div>
</template>
