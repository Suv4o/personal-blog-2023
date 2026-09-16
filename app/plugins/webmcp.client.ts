// Installs the WebMCP runtime on `document.modelContext`.
//
// The import is the whole job: `@mcp-b/global` auto-initialises on load, and it
// defers to the browser's native implementation when one exists, so this is a
// no-op on a Chrome that already ships WebMCP.
//
// Client-only by filename — the blog is statically generated, and there is no
// `document` to attach to during prerender.
import "@mcp-b/global";

export default defineNuxtPlugin(() => {});
