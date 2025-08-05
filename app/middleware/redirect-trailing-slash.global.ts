export default defineNuxtRouteMiddleware((to, from) => {
    if (to.path !== "/" && to.path.endsWith("/")) {
        const nextPath = to.path.replace(/\/+$/, "") || "/";
        return navigateTo({ path: nextPath, query: to.query, hash: to.hash }, { redirectCode: 301 });
    }
});
