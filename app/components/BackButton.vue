<script setup lang="ts">
const route = useRoute();

const parentPath = computed(() => {
    const pathSegments = route.path.split("/").filter((segment) => segment !== "");
    if (pathSegments.length > 1) {
        pathSegments.pop();
        return "/" + pathSegments.join("/");
    }
    return "/";
});
</script>

<template>
    <Button classes="my-8" :link="parentPath">← Back</Button>
</template>
