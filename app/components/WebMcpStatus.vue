<script setup lang="ts">
// The global augmentation declares `ModelContext` as the WebIDL interface object
// (a value), so the type has to be imported explicitly.
import type { ModelContext } from "@mcp-b/webmcp-types";

const config = useRuntimeConfig();
const isDev = config.public.isDev as boolean;

const status = ref<"loading" | "ready" | "unavailable">("loading");
const toolCount = ref(0);

let modelContext: ModelContext | undefined;

async function refreshToolCount() {
    try {
        toolCount.value = (await modelContext!.getTools()).length;
        status.value = toolCount.value > 0 ? "ready" : "unavailable";
    } catch {
        status.value = "unavailable";
    }
}

onMounted(() => {
    if (!isDev) {
        status.value = "unavailable";
        return;
    }

    modelContext = document.modelContext;

    if (!modelContext) {
        status.value = "unavailable";
        return;
    }

    // registerTool() is async, so the sibling WebMcpTools component may not have
    // finished when this mounts. Count now, then let toolchange keep it honest.
    modelContext.addEventListener("toolchange", refreshToolCount);
    void refreshToolCount();
});

onUnmounted(() => {
    modelContext?.removeEventListener("toolchange", refreshToolCount);
});
</script>

<template>
    <div v-if="status === 'ready'" class="flex items-center justify-center gap-2 py-2 text-xs text-gray opacity-60">
        <span class="inline-block h-2 w-2 rounded-full bg-green"></span>
        <span>WebMCP: {{ toolCount }} tools registered</span>
    </div>
</template>
