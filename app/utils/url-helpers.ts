export function isBlogPostUrl(url: string | null | undefined): boolean {
    if (!url) return false;

    const blogPostPattern = /^\/\d{4}\/\d{2}\/\d{2}\/[a-zA-Z0-9-]+/;
    return blogPostPattern.test(url);
}
