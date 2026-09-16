import type { CallToolResult, InputSchema, WebMcpToolAnnotations } from "@mcp-b/webmcp-types";

export interface McpToolOptions {
    name: string;
    /** Human-friendly label a browser may show the user before running the tool. */
    title?: string;
    description: string;
    inputSchema: InputSchema;
    /**
     * Hints about how the tool behaves. `readOnlyHint` marks a tool that changes
     * nothing, so an agent can call it freely.
     */
    annotations?: WebMcpToolAnnotations;
    execute: (input: Record<string, unknown>) => Promise<CallToolResult> | CallToolResult;
}

/**
 * Registers a WebMCP tool for the lifetime of the calling component.
 *
 * Registration happens on mount (the runtime is installed by the
 * `webmcp.client.ts` plugin, so there is nothing to await) and is torn down by
 * aborting the signal handed to `registerTool` — the spec's replacement for the
 * old `unregisterTool()`.
 */
export function useMcpTool(options: McpToolOptions) {
    let controller: AbortController | null = null;

    onMounted(() => {
        const modelContext = document.modelContext;

        if (!modelContext) {
            return;
        }

        controller = new AbortController();

        void modelContext
            .registerTool(
                {
                    name: options.name,
                    title: options.title,
                    description: options.description,
                    inputSchema: options.inputSchema,
                    annotations: options.annotations,
                    execute: options.execute,
                },
                { signal: controller.signal },
            )
            .catch((error: unknown) => {
                // registerTool rejects on a duplicate name, so surface it rather
                // than letting the tool silently go missing.
                console.error(`[WebMCP] Failed to register "${options.name}":`, error);
            });
    });

    onUnmounted(() => {
        controller?.abort();
        controller = null;
    });
}
