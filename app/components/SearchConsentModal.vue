<script setup lang="ts">
const emit = defineEmits<{ accept: []; decline: [] }>();
</script>

<template>
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-secondary/60 p-4">
        <div
            class="gradiant-orange w-full max-w-lg rounded-md border-2 border-white p-6 text-secondary shadow-[10px_10px] shadow-beige"
        >
            <h2 class="text-2xl sm:text-3xl text-center mb-4"><strong>SEMANTIC SEARCH</strong></h2>
            <p class="mb-3">
                Searching uses on-device AI models. The first time you search, your browser will download about
                <strong>180&nbsp;MB</strong> of models and cache them in IndexedDB. Future searches load instantly and
                your queries never leave your device.
            </p>
            <p class="mb-4 text-sm">
                Models:
                <code class="bg-beige px-1 rounded text-secondary">Xenova/all-MiniLM-L6-v2</code>
                and
                <code class="bg-beige px-1 rounded text-secondary">Xenova/clip-vit-base-patch32</code>.
            </p>
            <div class="flex flex-col sm:flex-row gap-3 justify-center mt-4">
                <button
                    type="button"
                    class="rounded-md border-2 border-white bg-beige px-4 py-2 text-secondary font-medium shadow-[5px_-3px_7px] shadow-secondary cursor-pointer"
                    @click="emit('accept')"
                >
                    Use semantic search
                </button>
                <button
                    type="button"
                    class="rounded-md border-2 border-white bg-transparent px-4 py-2 text-secondary font-medium cursor-pointer"
                    @click="emit('decline')"
                >
                    Use keyword search only
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.gradiant-orange {
    background: rgb(var(--color-primary-light));
    background: -moz-linear-gradient(90deg, rgb(var(--color-primary-light)) 0%, rgb(var(--color-primary)) 100%);
    background: -webkit-linear-gradient(90deg, rgb(var(--color-primary-light)) 0%, rgb(var(--color-primary)) 100%);
    background: linear-gradient(90deg, rgb(var(--color-primary-light)) 0%, rgb(var(--color-primary)) 100%);
}
</style>
