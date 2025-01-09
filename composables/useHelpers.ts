export function useHelpers() {
    function delay(timeout = 1000) {
        return new Promise((resolve) => setTimeout(resolve, timeout));
    }

    const pagePaths = [
        "/",
        "/articles",
        "/vuejs",
        "/javascript",
        "/frontend",
        "/firebase",
        "/nodejs",
        "/backend",
        "/css",
        "/typescript",
        "/nestjs",
        "/nuxtjs",
        "/vscode",
        "/vite",
        "/langchain",
        "/python",
        "/nitro",
        "/ai",
        "/other",
        "/reactjs",
        "/get-in-touch",
        "/unsubscribe",
    ];

    const listingPaths = [
        "/articles",
        "/vuejs",
        "/javascript",
        "/frontend",
        "/firebase",
        "/nodejs",
        "/backend",
        "/css",
        "/typescript",
        "/nestjs",
        "/nuxtjs",
        "/vscode",
        "/vite",
        "/langchain",
        "/python",
        "/nitro",
        "/ai",
        "/other",
        "/reactjs",
    ];

    return { pagePaths, listingPaths, delay };
}
