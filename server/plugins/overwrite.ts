export default defineNitroPlugin((nitro) => {
    nitro.hooks.hook("render:response", (response, { event }) => {
        if (event.node.req.url === "/2024/01/23/how-to-define-multiple-components-in-a-single-file-in-nuxt-using-jsx") {
            response.body = response.body.replaceAll('\\"{props.href}>{props.name}\\"', "{props.href}>{props.name}");
        }
    });
});
