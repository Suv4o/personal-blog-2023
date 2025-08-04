<script setup lang="ts">
if (import.meta.client) {
    throw createError({
        statusCode: 404,
        statusMessage: "Page Not Found",
    });
}
</script>

<template>
    <div class="al-container">
        <NotFound />
    </div>
</template>
