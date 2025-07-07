<script setup lang="ts">
const keyboards = [
    {
        id: 1,
        title: "🐾 Pastel Paws",
        href: "/the-keyboard-lab/pastel-paws",
        description: "cute, dreamy, pastel, cat-inspired",
        imageUrl:
            "https://images.unsplash.com/photo-1496128858413-b36217c2ce36?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3603&q=80",
    },
    {
        id: 2,
        title: "🍋 Lemon Milk",
        href: "/the-keyboard-lab/lemon-milk",
        description: "refreshing, warm, creamy, sunny",
        imageUrl:
            "https://images.unsplash.com/photo-1496128858413-b36217c2ce36?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3603&q=80",
    },
    {
        id: 3,
        title: "🕹️ Retrograde",
        href: "/the-keyboard-lab/retrograde",
        description: "sci-fi meets vintage, minimal, retro",
        imageUrl:
            "https://images.unsplash.com/photo-1496128858413-b36217c2ce36?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3603&q=80",
    },
];
</script>

<template>
    <div class="mx-auto mt-12 mb-12 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
        <article v-for="keyboard in keyboards" :key="keyboard.id" class="flex flex-col items-start justify-between">
            <NuxtLink :to="keyboard.href">
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
