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
];
</script>

<template>
    <div class="mt-12 mb-12 grid w-full grid-cols-1 gap-y-20 gap-x-8 px-4 sm:px-6 lg:px-0 lg:mx-0 lg:grid-cols-3">
        <article v-for="keyboard in keyboards" :key="keyboard.id" class="flex flex-col items-start justify-between">
            <NuxtLink
                :to="keyboard.href"
                class="block w-full lg:hover:scale-105 lg:focus:scale-105 focus:outline-none transition-transform duration-300 ease-in-out"
            >
                <div class="relative w-full">
                    <img
                        :src="keyboard.imageUrl"
                        alt=""
                        class="aspect-video w-full rounded-2xl object-cover sm:aspect-2/1 lg:aspect-3/2"
                    />
                </div>
                <div class="max-w-xl">
                    <div class="group relative">
                        <h3 class="mt-3 text-2xl font-semibold text-secondary">
                            <span class="absolute inset-0" />
                            {{ keyboard.title }}
                        </h3>
                        <div class="mt-5">
                            <TheKeyboardLabTags :description="keyboard.description" />
                        </div>
                    </div>
                </div>
            </NuxtLink>
        </article>
    </div>
</template>
