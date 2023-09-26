export function usePrism() {
    onMounted(() => {
        loadPrismScript();
    });

    function loadPrismScript() {
        const prismScript = document.createElement("script");
        prismScript.setAttribute("src", "/prism/prism.js");
        document.body.appendChild(prismScript);
    }

    return { loadPrismScript };
}
