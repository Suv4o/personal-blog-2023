import type { Article } from "~/types";

interface SimilarArticlesResponse {
    success: boolean;
    data: Array<{
        articlePath: string;
        embeddings: number[];
    }>;
    requestedPath?: string | string[];
    error?: string;
}

const CATEGORIES = [
    { name: "All Articles", path: "/articles" },
    { name: "Vue.js", path: "/vuejs" },
    { name: "JavaScript", path: "/javascript" },
    { name: "Front End", path: "/frontend" },
    { name: "Firebase", path: "/firebase" },
    { name: "Node.js", path: "/nodejs" },
    { name: "Back End", path: "/backend" },
    { name: "CSS", path: "/css" },
    { name: "TypeScript", path: "/typescript" },
    { name: "NestJS", path: "/nestjs" },
    { name: "Nuxt.js", path: "/nuxtjs" },
    { name: "VS Code", path: "/vscode" },
    { name: "Vite", path: "/vite" },
    { name: "AWS", path: "/aws" },
    { name: "LangChain", path: "/langchain" },
    { name: "Python", path: "/python" },
    { name: "Nitro", path: "/nitro" },
    { name: "AI", path: "/ai" },
    { name: "React.js", path: "/reactjs" },
    { name: "Other", path: "/other" },
];

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

export async function registerWebMCPTools(nuxtApp: any) {
    const mc = navigator.modelContext;
    if (!mc) {
        console.warn("[WebMCP] navigator.modelContext is not available");
        return 0;
    }

    const router = nuxtApp.$router;

    // Tool 1: Search Articles
    mc.registerTool({
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
        execute: async (params: { query?: string; category?: string }) => {
            try {
                const allArticles = (await queryCollection("content")
                    .where("blog", "=", "post")
                    .all()) as Article[];

                let results = allArticles;

                if (params.query) {
                    const q = params.query.toLowerCase();
                    results = results.filter(
                        (a) =>
                            a.title.toLowerCase().includes(q) ||
                            a.description.toLowerCase().includes(q) ||
                            a.keywords.some((k) => k.toLowerCase().includes(q)),
                    );
                }

                if (params.category) {
                    const cat = params.category.toLowerCase();
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
    mc.registerTool({
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
        execute: async (params: { path: string }) => {
            try {
                const article = (await queryCollection("content")
                    .path(params.path)
                    .first()) as Article | null;

                if (!article) {
                    return {
                        content: [
                            {
                                type: "text",
                                text: JSON.stringify({
                                    error: `Article not found at path: ${params.path}`,
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
    mc.registerTool({
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
                    const count =
                        cat.path === "/articles"
                            ? allArticles.length
                            : allArticles.filter((a) =>
                                  a.articleTags.some(
                                      (t) => t.toLowerCase() === cat.name.toLowerCase(),
                                  ),
                              ).length;
                    return { ...cat, articleCount: count };
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
    mc.registerTool({
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
        execute: async (params: { count?: number }) => {
            try {
                const count = Math.min(Math.max(params.count || 5, 1), 10);

                const articles = (await queryCollection("content")
                    .where("blog", "=", "post")
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
    mc.registerTool({
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
        execute: async (params: { path: string }) => {
            try {
                const response = await $fetch<SimilarArticlesResponse>(
                    `/api/similar-articles${params.path}`,
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
    mc.registerTool({
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
        execute: async (params: { path: string }) => {
            try {
                await router.push(params.path);
                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify({
                                success: true,
                                navigatedTo: params.path,
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

    const toolCount = 6;
    console.log(`[WebMCP] ${toolCount} tools registered successfully`);
    return toolCount;
}
