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
        "/other",
    ];

    return { pagePaths, delay };
}
