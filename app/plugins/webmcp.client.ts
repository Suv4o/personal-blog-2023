export default defineNuxtPlugin(async (nuxtApp) => {
    try {
        await import("@mcp-b/global");
        const { registerWebMCPTools } = await import("~/utils/webmcp-tools");
        const toolCount = await registerWebMCPTools(nuxtApp);
        return {
            provide: {
                webmcpToolCount: toolCount,
            },
        };
    } catch (error) {
        console.warn("[WebMCP] Failed to initialize:", error);
        return {
            provide: {
                webmcpToolCount: 0,
            },
        };
    }
});
