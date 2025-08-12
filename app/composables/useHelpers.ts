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

    const isThroughTheLensSlugPage = computed(() => {
        return route.path.startsWith("/through-the-lens/") && route.path !== "/through-the-lens";
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
        "/the-keyboard-lab",
        "/the-keyboard-lab/lemon-milk",
        "/the-keyboard-lab/pastel-paws",
        "/the-keyboard-lab/retrograde",
        "/through-the-lens",
        "/through-the-lens/starlit-wonders",
        "/through-the-lens/liquid-cascades",
        "/through-the-lens/ocean-whispers",
        "/through-the-lens/urban-glow",
        "/through-the-lens/time-in-motion",
        "/through-the-lens/wild-horizons",
        "/through-the-lens/starlit-wonders/split-point-lighthouse",
        "/through-the-lens/starlit-wonders/watching-the-aurora-borealis",
        "/through-the-lens/starlit-wonders/aurora-borealis-over-the-great-ocean-road",
        "/through-the-lens/starlit-wonders/aurora-borealis-from-teddys-lookout",
        "/through-the-lens/starlit-wonders/star-trails-over-camel-rock",
        "/through-the-lens/starlit-wonders/star-trails-at-cape-schanck-lighthouse",
        "/through-the-lens/starlit-wonders/star-trails-at-cape-schanck",
        "/through-the-lens/starlit-wonders/milky-way-over-the-pinnacles",
        "/through-the-lens/starlit-wonders/milky-way-over-mount-donna-buang",
        "/through-the-lens/starlit-wonders/star-trails-at-pinnacles",
        "/through-the-lens/starlit-wonders/star-trails-at-pinnacles-phillip-island",
        "/through-the-lens/starlit-wonders/ss-speke-shipwreck",
        "/through-the-lens/starlit-wonders/star-trails",
        "/through-the-lens/starlit-wonders/star-trails-at-uluru",
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

    return {
        pagePaths,
        listingPaths,
        isBlogArticle,
        isListingPage,

        isThroughTheLensSlugPage,
        delay,
    };
}
