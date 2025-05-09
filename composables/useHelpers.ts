export function useHelpers() {
    const route = useRoute();

    function delay(timeout = 1000) {
        return new Promise((resolve) => setTimeout(resolve, timeout));
    }

    const isBlogArticle = computed(() => {
        return !pagePaths.includes(route.path);
    });

    const isListingPage = computed(() => {
        return listingPaths.includes(route.path);
    });

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

    return { pagePaths, listingPaths, isBlogArticle, isListingPage, delay };
}
