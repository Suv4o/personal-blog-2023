export function usePrism() {
    onMounted(() => {
        loadPrismScript();
    });

    function loadPrismScript() {
        const findPrismScript = document.getElementById("prismScript");
        if (findPrismScript) {
            return;
        }
        const prismScript = document.createElement("script");
        prismScript.setAttribute("id", "prismScript");
        prismScript.setAttribute("src", "/prism/prism.js");
        document.body.appendChild(prismScript);
    }

    function unloadPrismScript() {
        const prismScript = document.getElementById("prismScript");
        if (prismScript) {
            prismScript.remove();
        }
    }

    return { loadPrismScript, unloadPrismScript };
}
