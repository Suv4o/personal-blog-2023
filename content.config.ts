import { defineCollection, defineContentConfig, z } from "@nuxt/content";

export default defineContentConfig({
    collections: {
        content: defineCollection({
            source: "**/*.md",
            type: "page",
            schema: z.object({
                title: z.string(),
                description: z.string(),
                image: z.string().url(),
                keywords: z.array(z.string()),
                type: z.string(),
                blog: z.string(),
                published: z.string(),
                readTime: z.number(),
                author: z.string(),
                articleTags: z.array(z.string()),
            }),
        }),
    },
});
