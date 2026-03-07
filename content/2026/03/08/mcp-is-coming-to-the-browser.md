---
title: "MCP Is Coming to the Browser: WebMCP and the Future of AI-Powered Websites"
description: WebMCP is a new browser standard that lets websites expose structured tools for AI agents. Learn how it works, how to implement both the Imperative and Declarative APIs, and how to test your WebMCP tools using real MCP clients like VS Code, Claude Desktop, and more.
image: https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_1200,e_sharpen:100/v1772448782/blog/mcp-is-coming-to-the-browser-webmcp-and-the-future-of-ai-powered-websites/hero-mcp-is-coming-to-the-browser_ntmegq
keywords:
    - WebMCP
    - Web Model Context Protocol
    - MCP
    - Model Context Protocol
    - AI agents
    - browser AI
    - navigator.modelContext
    - Chrome 146
    - mcp-b/global
    - imperative API
    - declarative API
    - toolname
    - tooldescription
    - chrome-devtools-mcp
    - AI browser tools
    - structured tools
    - web development
    - JavaScript
    - TypeScript
type: page
blog: post
published: 8th March 2026
readTime: 10
author: Aleksandar Trpkovski
articleTags:
    - AI
    - JavaScript
    - FrontEnd
---

# MCP Is Coming to the Browser: WebMCP and the Future of AI-Powered Websites

_{{$document.published}} • {{$document.readTime}} min read - by **[{{$document.author}}](/)**_

::tag-pills{:tags="articleTags"}
::

::audio-player{:audioSrc="https://cdn.jsdelivr.net/gh/Suv4o/personal-blog-2023/audio-summary/2026/03/08/mcp-is-coming-to-the-browser/summary.mp3" :transcriptSrc="https://cdn.jsdelivr.net/gh/Suv4o/personal-blog-2023/audio-summary/2026/03/08/mcp-is-coming-to-the-browser/summary.json"}
::

![Landing Image](https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_750,e_sharpen:100/v1772448782/blog/mcp-is-coming-to-the-browser-webmcp-and-the-future-of-ai-powered-websites/hero-mcp-is-coming-to-the-browser_ntmegq)

What if your website could talk directly to AI agents - not through brittle screen-scraping or DOM crawling, but through clean, structured tool calls? What if an agent could search your product catalogue, submit a form, or navigate your site the same way a developer would call an API?

<a href="https://developer.chrome.com/blog/webmcp-epp" target="_blank" rel="noopener noreferrer">**WebMCP**</a> (Web Model Context Protocol) was released a few weeks ago as an early preview in Chrome, and it is a game changer. It's a new browser standard - developed by the <a href="https://webmachinelearning.github.io/webmcp/" target="_blank" rel="noopener noreferrer">W3C Web Machine Learning Community Group</a> - that lets any website expose structured tools for AI agents to discover and use. No more fragile screen-scraping. No more navigating through nested `<div>`s hoping to find the right button. Instead, your website tells the agent exactly what it can do, and the agent calls those tools with structured inputs and gets structured outputs back.

In this article, I'll explain what WebMCP is, walk you through both of its browser APIs (Imperative and Declarative), show you how to add it to any website regardless of framework, and demonstrate how to test your tools with real AI clients like VS Code and Claude Desktop. I'll also share how I added WebMCP to my own blog as a real-world example.

Let's dive in.

## Why WebMCP Is a Game Changer

Imagine if every website on the web had WebMCP. You could ask any AI agent: _"Go to this e-commerce site and find me a blue jacket under $50"_ - and instead of the agent opening a browser, taking screenshots, parsing pixels, and clicking through filters one by one, the website would simply expose a `search_products` tool. The agent calls it with `{ query: "blue jacket", maxPrice: 50 }` and gets back structured JSON with exactly the results you need.

This will revolutionise how AI agents interact with the web. Instead of guessing and scraping, agents call well-defined, structured tools exposed directly by the website itself. It's the difference between:

- **Today**: Agent takes a screenshot → runs OCR (Optical Character Recognition) → guesses what to click → hopes it worked → takes another screenshot → repeats
- **With WebMCP**: Agent calls `search_products({ query: "blue jacket", maxPrice: 50 })` → gets JSON back instantly

The token savings alone are significant. According to benchmarks from the <a href="https://github.com/WebMCP-org/chrome-devtools-quickstart" target="_blank" rel="noopener noreferrer">WebMCP quickstart project</a>, WebMCP tools use **77–89% fewer tokens** compared to screenshot-based approaches. That translates directly to lower costs and faster responses.

## What Is WebMCP?

WebMCP extends the <a href="https://modelcontextprotocol.io/" target="_blank" rel="noopener noreferrer">Model Context Protocol (MCP)</a> - the open standard for connecting AI models to external tools and data sources - into the browser. It introduces a new browser API: `navigator.modelContext`, which allows any web page to register tools that AI agents can discover and call.

The core idea is simple:

1. A website **registers tools** with names, descriptions, input schemas, and execute callbacks
2. An AI agent **discovers** those tools through `navigator.modelContext`
3. The agent **calls** a tool with structured parameters
4. The tool **executes** and returns structured results

WebMCP provides two ways to register tools: the **Imperative API** (JavaScript) and the **Declarative API** (HTML attributes). Let's look at both.

## The Imperative API

The Imperative API is the JavaScript approach. You call `navigator.modelContext.registerTool()` with a tool definition object. This gives you full control - you can run any logic in the execute callback, access application state, make API calls, or trigger navigation.

Here's a simple example - a tool that searches a product catalogue:

```js
navigator.modelContext.registerTool({
    name: "search_products",
    description: "Search for products by keyword, category, or price range",
    inputSchema: {
        type: "object",
        properties: {
            query: {
                type: "string",
                description: "Search keyword",
            },
            category: {
                type: "string",
                description: "Product category to filter by",
            },
            maxPrice: {
                type: "number",
                description: "Maximum price",
            },
        },
    },
    execute: async ({ query, category, maxPrice }) => {
        const results = await searchProducts({ query, category, maxPrice });

        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        count: results.length,
                        products: results,
                    }),
                },
            ],
        };
    },
});
```

Let me break down the key parts:

- **`name`** - A unique identifier for the tool. Agents use this to call it.
- **`description`** - A natural language description of what the tool does. This is what the agent reads to decide whether to use it.
- **`inputSchema`** - A JSON Schema object describing the expected parameters. The agent uses this to construct valid inputs.
- **`execute`** - An async callback that runs when the agent calls the tool. It receives the parameters and must return a result in the MCP content format: `{ content: [{ type: "text", text: "..." }] }`.

If something goes wrong, you can signal an error by adding `isError: true` to the response:

```ts
return {
    content: [{ type: "text", text: JSON.stringify({ error: "Item not found" }) }],
    isError: true,
};
```

### Other Imperative API Methods

Beyond `registerTool()`, the `navigator.modelContext` API provides a few more methods:

- **`unregisterTool(name)`** - Removes a previously registered tool
- **`provideContext(tools)`** - Replaces the entire toolset at once (useful when application state changes)
- **`clearContext()`** - Removes all registered tools

## The Declarative API

The Declarative API is the zero-JavaScript approach. If you have an existing HTML form, you can turn it into a WebMCP tool by adding just two attributes:

```html
<form
    toolname="reserve_table"
    tooldescription="Reserve a table at the restaurant"
    toolautosubmit
    action="/reservations"
>
    <label for="date">Date</label>
    <input type="date" name="date" id="date" required />

    <label for="guests">Number of Guests</label>
    <input type="number" name="guests" id="guests" min="1" max="20" required />

    <label for="name">Your Name</label>
    <input type="text" name="name" id="name" required />

    <button type="submit">Reserve</button>
</form>
```

The three attributes are:

- **`toolname`** - The name of the tool (required). The browser uses this as the tool identifier.
- **`tooldescription`** - A natural language description of what the form does (required). The agent reads this to decide when to use it.
- **`toolautosubmit`** - When present, the form is automatically submitted after the agent fills in the fields. Without this, the agent fills the form but the user must manually submit it.

The browser automatically translates the form fields into a JSON Schema based on the `<input>` types, `name` attributes, and validation constraints (`required`, `min`, `max`, etc.). No JavaScript needed.

### CSS Pseudo-Classes for Agent Interaction

WebMCP also introduces CSS pseudo-classes to let you style forms differently when an agent is interacting with them:

```css
/* Style the form when an agent is actively filling it */
form:tool-form-active {
    outline: 2px solid #4caf50;
    background: #f0fff0;
}

/* Style the submit button when the agent is about to submit */
button:tool-submit-active {
    background: #4caf50;
    color: white;
}
```

This gives users visual feedback that an AI agent is interacting with the page - a nice touch for transparency.

### A Note on Declarative API Testing

> One important thing to be aware of: the Declarative API (HTML form attributes) currently **cannot be tested** with the MCP client methods I'll describe later in this article.

Both testing methods rely on the `@mcp-b/global` polyfill to provide the `navigator.modelContext` API. This polyfill only implements the **Imperative API** - it provides `registerTool()`, `unregisterTool()`, and the other JavaScript methods. It does **not** scan the DOM for forms with `toolname` and `tooldescription` attributes.

The form-to-tool translation is a **native Chrome browser feature**. Chrome itself parses the DOM, detects annotated forms, and auto-registers them as tools behind the scenes. Since the polyfill doesn't do this, only your imperative tools will appear when testing with MCP clients.

The declarative forms will work once Chrome's native WebMCP implementation is fully available - keep an eye on the `chrome://flags` "WebMCP for testing" flag. In the meantime, I still recommend adding the declarative attributes to your forms now so they're ready when native support lands.

## Setting Up WebMCP on Your Website

WebMCP is currently available in **Chrome 146+** behind a feature flag. To enable it:

1. Open `chrome://flags/` in your browser
2. Search for **"Experimental Web Platform features"**
3. Set it to **Enabled**
4. Relaunch Chrome

You can also join the <a href="https://developer.chrome.com/blog/webmcp-epp" target="_blank" rel="noopener noreferrer">early preview programme</a> for access to the full documentation and demos.

### Installing the Polyfill

Since WebMCP is still behind a flag and not available in all browsers, you'll want to use the `@mcp-b/global` polyfill. This package provides `navigator.modelContext` for browsers that don't natively support it yet.

```bash
npm install @mcp-b/global
```

Then import it before registering your tools:

```ts
import "@mcp-b/global";

// Now navigator.modelContext is available
navigator.modelContext.registerTool({
    name: "my_tool",
    description: "Does something useful",
    inputSchema: { type: "object", properties: {} },
    execute: async () => {
        return {
            content: [{ type: "text", text: "Hello from my tool!" }],
        };
    },
});
```

The polyfill automatically detects whether native browser support exists and only activates when needed. So your code will work in both polyfilled and native environments.

## Testing Your WebMCP Tools

Now here's the fun part - actually testing your tools with real AI agents. I tested two methods, both of which work brilliantly.

### Method 1: `@mcp-b/chrome-devtools-mcp` (Recommended)

This is the method I recommend and the one I use myself. <a href="https://docs.mcp-b.ai/packages/chrome-devtools-mcp" target="_blank" rel="noopener noreferrer">**@mcp-b/chrome-devtools-mcp**</a> is an MCP server that connects your AI client (VS Code, Claude Desktop, Claude Code, Cursor) to a live Chrome browser. It provides two WebMCP-specific tools: `list_webmcp_tools` and `call_webmcp_tool`, which let your AI agent discover and call any tools registered via `navigator.modelContext`.

> **Important:** This is different from Google's official `chrome-devtools-mcp`. Google's version handles browser automation (screenshots, navigation, script evaluation) but does **not** support WebMCP tool discovery. Make sure you use `@mcp-b/chrome-devtools-mcp` (the MCP-B version) for WebMCP testing.

Here's how to set it up for different clients:

**VS Code** (my preferred setup):

```bash
code --add-mcp '{"name":"chrome-devtools","command":"npx","args":["-y","@mcp-b/chrome-devtools-mcp@latest"]}'
```

**Claude Code:**

```bash
claude mcp add chrome-devtools npx @mcp-b/chrome-devtools-mcp@latest
```

**Claude Desktop** (add to `claude_desktop_config.json`):

```json
{
    "mcpServers": {
        "chrome-devtools": {
            "command": "npx",
            "args": ["-y", "@mcp-b/chrome-devtools-mcp@latest"]
        }
    }
}
```

**Cursor:** To find the direct installer to set up Cursor, go to the <a href="https://docs.mcp-b.ai/packages/chrome-devtools-mcp#cursor" target="_blank" rel="noopener noreferrer">mcp-b documentation here</a>.

Once set up, start your development server, open your site in Chrome, and ask your AI agent to interact with it.

Here is a conversation example I did after setting up my VS Code using Claude Sonnet 4.6:

**Me:** _"Navigate to <a href="https://www.trpkovski.com" target="_blank" rel="noopener noreferrer"><span>h</span>ttps://www.trpkovski.com</a>, list available WebMCP tools"_

**Agent:** Found 6 available WebMCP tools:

| Tool                 | Description                                                       |
| -------------------- | ----------------------------------------------------------------- |
| search_articles      | Search blog articles by keyword and/or category                   |
| get_article          | Get full details of a specific article by path                    |
| list_categories      | List all available blog categories                                |
| get_recent_articles  | Get the most recently published articles (up to 10)               |
| get_similar_articles | Find articles similar to a given one using AI semantic similarity |
| navigate_to          | Navigate to a specific page on the blog                           |

**Me:** _"Can you help me find any article about Nest.js with Firebase Auth"_

**Agent:** Found it! There's a directly relevant article: **Nest.js Authorisation with Firebase Auth** - Published: 7th October 2022 · 15 min read. Tags: Nest.js, Firebase, Node.js. There's also a follow-up: **Nest.js @CurrentUser Custom Decorator** - Published: 10th October 2022 · 5 min read.

**Me:** _"Is there any similar articles to Nest.js Authorisation with Firebase Auth"_

**Agent:** Here are 3 similar articles: **Nest.js Auth/Authorisation with Okta** (3rd Oct 2022, 16 min), **Nest.js @CurrentUser Custom Decorator** (10th Oct 2022, 5 min), and **Firebase Auth token verification with a custom backend server** (13th Jul 2021, 9 min).

The agent discovered the tools, called `search_articles` to find the Nest.js article, and then called `get_similar_articles` to find related content - all through structured tool calls, no screen-scraping involved.

You can also try this yourself on my blog at <a href="https://www.trpkovski.com" target="_blank" rel="noopener noreferrer"><span>h</span>ttps://www.trpkovski.com</a> - once you have your client set up, go ahead and explore the tools.

### Method 2: MCP-B Browser Extension (Alternative)

If you prefer testing directly in the browser without setting up an external AI client, the <a href="https://chromewebstore.google.com/detail/mcp-b-extension/daohopfhkdelnpemnhlekblhnikhdhfa" target="_blank" rel="noopener noreferrer">**MCP-B Browser Extension**</a> is a great alternative. Install it from the Chrome Web Store, click the icon in your toolbar, and it opens a sidebar with an AI agent that automatically discovers WebMCP tools from all your open tabs.

You can read more about it in the <a href="https://docs.mcp-b.ai/extension" target="_blank" rel="noopener noreferrer">MCP-B Extension documentation</a>.

## Adding WebMCP to My Blog

To put all of this into practice, I added WebMCP to this blog. The goal was to let AI agents search articles, explore categories, find related content, and navigate the site - all through structured tools.

I built **six imperative tools** and added **declarative attributes** to two existing forms. Here's what each tool does:

### search_articles

Searches blog posts by keyword and/or category tag. The keyword matches against article titles, descriptions, and keywords. The category filter matches against article tags. Both parameters are optional - you can search by keyword only, category only, or both. Returns the count of matching articles along with their title, path, description, published date, read time, author, tags, and image.

### get_article

Gets the full details of a specific article by its path. You pass in the article path (e.g. `/2024/01/15/my-article-slug`) and it returns the article's title, description, image URL, tags, published date, read time, and author. Useful when the agent already knows which article it wants to inspect.

### list_categories

Lists all 25 blog categories with the number of articles in each. Takes no parameters. Returns an array of categories, each with a display name, URL path, and article count. This helps the agent understand what topics the blog covers before searching.

### get_recent_articles

Returns the most recently published blog posts. Accepts an optional `count` parameter (defaults to 5, maximum 10). Useful for agents that want to know what's new on the blog without searching for a specific topic.

### get_similar_articles

Finds articles semantically similar to a given article using AI-powered embeddings. You pass in an article path and it returns the 3 most related articles. Under the hood, it calls the blog's existing similarity API, which uses pre-generated vector embeddings and cosine similarity to find the closest matches.

### navigate_to

Navigates the browser to a specific page on the blog. Accepts any path - article pages, category listings, or special pages like `/about-me` and `/get-in-touch`. Returns a confirmation of the navigation. This lets the agent move the user to a relevant page after finding what they're looking for.

### Declarative Forms

I also added `toolname`, `tooldescription`, and `toolautosubmit` attributes to the **newsletter subscription** form (`subscribe_newsletter`) and the **contact** form (`send_message`). These are ready for when Chrome's native Declarative API support is fully available.

You can find the full WebMCP integration - all tool definitions, the client plugin, and the status component - in the <a href="https://github.com/Suv4o/personal-blog-2023" target="_blank" rel="noopener noreferrer">blog's repository</a>.

## Looking Ahead

WebMCP is still in early preview, and things will evolve. But the direction is clear: the web is becoming a first-class platform for AI agent interaction. Instead of agents clumsily navigating websites the way a human would - clicking, scrolling, reading pixels - websites themselves will tell agents exactly what they can do.

What excites me most is the long-term vision. If WebMCP adoption grows and most websites start exposing structured tools, the way we interact with the web could fundamentally change. You wouldn't need to visit ten different airline websites to compare flight prices. You'd just ask your agent: _"Find me the cheapest flight to London next Friday"_ - and it would call `search_flights` on each airline's site, get structured results back, and give you a clean comparison in seconds.

We're still early, but this is the kind of infrastructure shift that makes the agentic web possible. If you build websites, I'd encourage you to start experimenting with WebMCP now. Add a few tools, test them with the methods I've described, and see how it feels. The polyfill makes it easy to get started today, and your tools will work natively once browser support matures.
