<script setup lang="ts">
interface CardItem {
    id: number | string;
    title: string;
    href: string;
    description: string;
    imageUrl: string;
}

const props = defineProps<{
    cards: CardItem[];
}>();
</script>

<template>
    <div class="mx-auto mt-12 mb-12 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
        <article v-for="card in props.cards" :key="card.id" class="flex flex-col items-start justify-between">
            <NuxtLink
                :to="card.href"
                class="block lg:hover:scale-105 lg:focus:scale-105 focus:outline-none transition-transform duration-300 ease-in-out"
            >
                <div class="relative w-full">
                    <img
                        :src="card.imageUrl"
                        alt=""
                        class="aspect-video w-full rounded-2xl object-cover sm:aspect-2/1 lg:aspect-3/2"
                    />
                </div>
                <div class="max-w-xl">
                    <div class="group relative">
                        <h3 class="mt-3 text-2xl font-semibold text-secondary">
                            <span class="absolute inset-0" />
                            {{ card.title }}
                        </h3>
                        <div class="mt-5">
                            <TheKeyboardLabTags :description="card.description" />
                        </div>
                    </div>
                </div>
            </NuxtLink>
        </article>
    </div>
</template>
