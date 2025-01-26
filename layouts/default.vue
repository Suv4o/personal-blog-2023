<script setup lang="ts">
const isError = ref(false);
</script>

<template>
    <div :class="isError && 'flex flex-col h-screen'">
        <header>
            <NavBar />
        </header>
        <main class="overflow-hidden" :class="isError && 'flex-grow'">
            <slot />
            <NuxtLink to="/unsubscribe" class="block h-0 w-0 invisible pointer-events-none" tabindex="0"
                >unsubscribe</NuxtLink
            >
        </main>
        <footer class="al-container" :class="isError && 'flex-shrink-0'">
            <Subscribe v-if="!isError" />
            <HorizontalRule />
            <p class="text-center text-secondary text-base mt-2 mb-12">
                © <ClientOnly>{{ new Date().getFullYear() }}</ClientOnly> Aleksandar Trpkovski
            </p>
        </footer>
    </div>
</template>

<style>
.grecaptcha-badge {
    @apply hidden;
}
</style>
