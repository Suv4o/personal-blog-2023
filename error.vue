<script setup lang="ts">
import type { NuxtError } from "#app";
import NotFound from "./components/NotFound.vue";

defineProps({
    error: Object as () => NuxtError,
});

const handleError = () => clearError({ redirect: "/" });
</script>

<template>
    <NuxtLayout>
        <HomeButton @click="handleError" />
        <div class="al-container">
            <NotFound v-if="error?.statusCode === 404" />
            <h1 v-else>An error occurred</h1>
        </div>
    </NuxtLayout>
</template>
