<script setup lang="ts">
const config = useRuntimeConfig();
const isDev = config.public.isDev as boolean;

const status = ref<"loading" | "ready" | "unavailable">("loading");
const toolCount = ref(0);

onMounted(async () => {
    if (!isDev) {
        status.value = "unavailable";
        return;
    }

    try {
        if (!navigator.modelContext) {
            status.value = "unavailable";
            return;
        }
        const testing = (navigator as any).modelContextTesting;
        if (testing?.listTools) {
            toolCount.value = testing.listTools().length;
        }
        status.value = toolCount.value > 0 ? "ready" : "unavailable";
    } catch {
        status.value = "unavailable";
    }
});
</script>

<template>
    <div v-if="status === 'ready'" class="flex items-center justify-center gap-2 py-2 text-xs text-gray opacity-60">
        <span class="inline-block h-2 w-2 rounded-full bg-green-500"></span>
        <span>WebMCP: {{ toolCount }} tools registered</span>
    </div>
</template>
