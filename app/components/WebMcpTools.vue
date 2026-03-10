<script setup lang="ts">
import type { Article } from "~/types";
import { CATEGORIES } from "~/utils/categories";

interface SimilarArticlesResponse {
    success: boolean;
    data: Array<{
        articlePath: string;
        embeddings: number[];
    }>;
    requestedPath?: string | string[];
    error?: string;
}

function formatArticle(article: Article) {
    return {
        title: article.title,
        path: article.path,
        description: article.description,
        published: article.published,
        readTime: article.readTime,
        author: article.author,
        tags: article.articleTags,
        image: article.image,
    };
}

const router = useRouter();

// Tool 1: Search Articles
useMcpTool({
    name: "search_articles",
    description:
        "Search blog articles by keyword and/or category on the Trpkovski tech blog. Returns matching articles with title, path, description, date, and tags.",
    inputSchema: {
        type: "object",
        properties: {
            query: {
                type: "string",
                description: "Search keyword to match against article titles and descriptions",
            },
            category: {
                type: "string",
                description:
                    "Filter by category tag (e.g. 'Vue.js', 'JavaScript', 'TypeScript', 'AI', 'Node.js', 'CSS', 'Firebase', 'Python', 'AWS')",
            },
        },
    },
    execute: async (args) => {
        try {
            const query = args.query as string | undefined;
            const category = args.category as string | undefined;

            const allArticles = (await queryCollection("content")
                .where("blog", "=", "post")
                .all()) as Article[];

            let results = allArticles;

            if (query) {
                const q = query.toLowerCase();
                results = results.filter(
                    (a) =>
                        a.title.toLowerCase().includes(q) ||
                        a.description.toLowerCase().includes(q) ||
                        a.keywords.some((k) => k.toLowerCase().includes(q)),
                );
            }

            if (category) {
                const cat = category.toLowerCase();
                results = results.filter((a) =>
                    a.articleTags.some((t) => t.toLowerCase().includes(cat)),
                );
            }

            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({
                            count: results.length,
                            articles: results.map(formatArticle),
                        }),
                    },
                ],
            };
        } catch (error) {
            return {
                content: [{ type: "text", text: JSON.stringify({ error: String(error) }) }],
                isError: true,
            };
        }
    },
});

// Tool 2: Get Article Details
useMcpTool({
    name: "get_article",
    description:
        "Get full details of a specific blog article by its path. Returns title, description, image, tags, published date, read time, and author.",
    inputSchema: {
        type: "object",
        properties: {
            path: {
                type: "string",
                description:
                    'The article path (e.g. "/2024/01/15/my-article-slug" or "/about-me")',
            },
        },
        required: ["path"],
    },
    execute: async (args) => {
        try {
            const path = args.path as string;

            const article = (await queryCollection("content")
                .path(path)
                .first()) as Article | null;

            if (!article) {
                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify({
                                error: `Article not found at path: ${path}`,
                            }),
                        },
                    ],
                    isError: true,
                };
            }

            return {
                content: [{ type: "text", text: JSON.stringify(formatArticle(article)) }],
            };
        } catch (error) {
            return {
                content: [{ type: "text", text: JSON.stringify({ error: String(error) }) }],
                isError: true,
            };
        }
    },
});

// Tool 3: List Categories
useMcpTool({
    name: "list_categories",
    description:
        "List all available blog categories with their paths. Use this to discover what topics the blog covers.",
    inputSchema: {
        type: "object",
        properties: {},
    },
    execute: async () => {
        try {
            const allArticles = (await queryCollection("content")
                .where("blog", "=", "post")
                .all()) as Article[];

            const categoriesWithCounts = CATEGORIES.map((cat) => {
                const count = allArticles.filter((a) =>
                    a.articleTags.some(
                        (t) => t.toLowerCase() === cat.tag.toLowerCase(),
                    ),
                ).length;
                return { name: cat.name, path: cat.path, articleCount: count };
            });

            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({ categories: categoriesWithCounts }),
                    },
                ],
            };
        } catch (error) {
            return {
                content: [{ type: "text", text: JSON.stringify({ error: String(error) }) }],
                isError: true,
            };
        }
    },
});

// Tool 4: Get Recent Articles
useMcpTool({
    name: "get_recent_articles",
    description:
        "Get the most recently published blog articles. Returns up to 10 articles sorted by date.",
    inputSchema: {
        type: "object",
        properties: {
            count: {
                type: "number",
                description: "Number of articles to return (default 5, max 10)",
            },
        },
    },
    execute: async (args) => {
        try {
            const count = Math.min(Math.max((args.count as number) || 5, 1), 10);

            const articles = (await queryCollection("content")
                .where("blog", "=", "post")
                .order("path", "DESC")
                .limit(count)
                .all()) as Article[];

            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({
                            count: articles.length,
                            articles: articles.map(formatArticle),
                        }),
                    },
                ],
            };
        } catch (error) {
            return {
                content: [{ type: "text", text: JSON.stringify({ error: String(error) }) }],
                isError: true,
            };
        }
    },
});

// Tool 5: Get Similar Articles
useMcpTool({
    name: "get_similar_articles",
    description:
        "Find articles similar to a given article using AI-powered semantic similarity. Returns the 3 most related articles.",
    inputSchema: {
        type: "object",
        properties: {
            path: {
                type: "string",
                description: 'The article path to find similar articles for (e.g. "/2024/01/15/my-article")',
            },
        },
        required: ["path"],
    },
    execute: async (args) => {
        try {
            const path = args.path as string;

            const response = await $fetch<SimilarArticlesResponse>(
                `/api/similar-articles${path}`,
                { responseType: "json" },
            );

            if (!response.success || !response.data.length) {
                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify({
                                error: response.error || "No similar articles found",
                            }),
                        },
                    ],
                    isError: true,
                };
            }

            const allArticles = (await queryCollection("content")
                .where("blog", "=", "post")
                .all()) as Article[];

            const similarArticles = response.data
                .map((item) => allArticles.find((a) => a.path === item.articlePath))
                .filter(Boolean)
                .map((a) => formatArticle(a as Article));

            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({
                            count: similarArticles.length,
                            articles: similarArticles,
                        }),
                    },
                ],
            };
        } catch (error) {
            return {
                content: [{ type: "text", text: JSON.stringify({ error: String(error) }) }],
                isError: true,
            };
        }
    },
});

// Tool 6: Navigate To
useMcpTool({
    name: "navigate_to",
    description:
        "Navigate to a specific page on the Trpkovski blog. Can navigate to articles, categories, or special pages like about-me and get-in-touch.",
    inputSchema: {
        type: "object",
        properties: {
            path: {
                type: "string",
                description:
                    'The page path to navigate to (e.g. "/articles", "/vuejs", "/about-me", "/2024/01/15/my-article")',
            },
        },
        required: ["path"],
    },
    execute: async (args) => {
        try {
            const path = args.path as string;

            await router.push(path);
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({
                            success: true,
                            navigatedTo: path,
                        }),
                    },
                ],
            };
        } catch (error) {
            return {
                content: [{ type: "text", text: JSON.stringify({ error: String(error) }) }],
                isError: true,
            };
        }
    },
});
</script>

<template>
    <div />
</template>
