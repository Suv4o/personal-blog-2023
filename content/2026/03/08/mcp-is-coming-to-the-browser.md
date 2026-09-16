---
title: "MCP Is Coming to the Browser: WebMCP and the Future of AI-Powered Websites"
description: WebMCP is a new browser standard that lets websites expose structured tools for AI agents. Learn how it works, how to implement both the Imperative and Declarative APIs against the current document.modelContext specification, and how to test your tools with the Chrome DevTools WebMCP panel, Chrome DevTools MCP, and desktop AI clients.
image: https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_1200,e_sharpen:100/v1772448782/blog/mcp-is-coming-to-the-browser-webmcp-and-the-future-of-ai-powered-websites/hero-mcp-is-coming-to-the-browser_ntmegq
keywords:
    - WebMCP
    - Web Model Context Protocol
    - MCP
    - Model Context Protocol
    - AI agents
    - browser AI
    - document.modelContext
    - navigator.modelContext
    - Chrome 149
    - WebMCP origin trial
    - mcp-b/global
    - imperative API
    - declarative API
    - toolname
    - tooldescription
    - toolparamdescription
    - chrome-devtools-mcp
    - webmcp-local-relay
    - Chrome DevTools WebMCP panel
    - AI browser tools
    - structured tools
    - web development
    - JavaScript
    - TypeScript
type: page
blog: post
published: 8th March 2026
updated: 16th September 2026
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

::article-updated{:date="updated"}
WebMCP has moved on a lot since this article was first published. The API now lives on `document.modelContext` instead of `navigator.modelContext`, tools are registered with a promise and unregistered with an `AbortSignal`, and the testing story has changed completely - Chrome DevTools now ships a dedicated WebMCP panel, and WebMCP tool discovery has been upstreamed into Google's official `chrome-devtools-mcp`. Every code sample and every testing instruction below has been rewritten against the current specification and Chrome documentation, and I've rebuilt this blog's own integration on `@mcp-b/global` v5 - retiring the `nuxt-mcp-b` module in the process.
::

What if your website could talk directly to AI agents - not through brittle screen-scraping or DOM crawling, but through clean, structured tool calls? What if an agent could search your product catalogue, submit a form, or navigate your site the same way a developer would call an API?

<a href="https://developer.chrome.com/docs/ai/webmcp" target="_blank" rel="noopener noreferrer">**WebMCP**</a> (Web Model Context Protocol) was released earlier this year as an early preview in Chrome, and it is a game changer. It's a new browser standard - developed by the <a href="https://webmachinelearning.github.io/webmcp/" target="_blank" rel="noopener noreferrer">W3C Web Machine Learning Community Group</a> - that lets any website expose structured tools for AI agents to discover and use. No more fragile screen-scraping. No more navigating through nested `<div>`s hoping to find the right button. Instead, your website tells the agent exactly what it can do, and the agent calls those tools with structured inputs and gets structured outputs back.

In this article, I'll explain what WebMCP is, walk you through both of its browser APIs (Imperative and Declarative), show you how to add it to any website regardless of framework, and demonstrate how to test your tools - both in Chrome DevTools and with real AI clients like VS Code, Cursor and Claude Desktop. I'll also share how I added WebMCP to my own blog as a real-world example.

Let's dive in.

## Why WebMCP Is a Game Changer

Imagine if every website on the web had WebMCP. You could ask any AI agent: _"Go to this e-commerce site and find me a blue jacket under $50"_ - and instead of the agent opening a browser, taking screenshots, parsing pixels, and clicking through filters one by one, the website would simply expose a `search_products` tool. The agent calls it with `{ query: "blue jacket", maxPrice: 50 }` and gets back structured JSON with exactly the results you need.

This will revolutionise how AI agents interact with the web. Instead of guessing and scraping, agents call well-defined, structured tools exposed directly by the website itself. It's the difference between:

- **Today**: Agent takes a screenshot → runs OCR (Optical Character Recognition) → guesses what to click → hopes it worked → takes another screenshot → repeats
- **With WebMCP**: Agent calls `search_products({ query: "blue jacket", maxPrice: 50 })` → gets JSON back instantly

The token savings alone are significant. Structured tool calls replace whole rounds of screenshots and DOM dumps, which means fewer tokens per task, lower costs, and faster responses.

## What Is WebMCP?

WebMCP extends the <a href="https://modelcontextprotocol.io/" target="_blank" rel="noopener noreferrer">Model Context Protocol (MCP)</a> - the open standard for connecting AI models to external tools and data sources - into the browser. It introduces a new browser API: `document.modelContext`, which allows any web page to register tools that AI agents can discover and call.

The core idea is simple:

1. A website **registers tools** with names, descriptions, input schemas, and execute callbacks
2. An AI agent **discovers** those tools through `document.modelContext`
3. The agent **calls** a tool with structured parameters
4. The tool **executes** and returns structured results

WebMCP provides two ways to register tools: the **Imperative API** (JavaScript) and the **Declarative API** (HTML attributes). Let's look at both.

### If You Remember `navigator.modelContext`, Read This First

When I first wrote this article, the entry point was `navigator.modelContext`. It isn't any more, and this is the single most common thing that trips people up when they copy a WebMCP snippet from an older blog post - including the first version of this one.

The registry of tools was always meant to belong to a **document**, not to the browsing context as a whole. But `navigator` is shared across the very first navigation away from `about:blank`, so tools registered before that first real navigation could leak into the page the user actually landed on. Fixing that scoping problem made it obvious the API was hanging off the wrong object, and the Community Group moved the getter onto `Document`:

```webidl
partial interface Document {
  [SecureContext, SameObject] readonly attribute ModelContext modelContext;
};
```

Chromium kept `navigator.modelContext` around for a while as an alias pointing at the same object, and then removed it. So:

- **Use `document.modelContext`.** That is what the specification, the Chrome documentation, and every current library use.
- **Don't feature-detect on `navigator.modelContext`.** On a current Chrome it is simply `undefined`, and your tools will silently never register.
- If you maintain an older integration, the migration is mostly a find-and-replace - but not entirely, because a few methods changed at the same time. I'll flag those as we go.

## The Imperative API

The Imperative API is the JavaScript approach. You call `document.modelContext.registerTool()` with a tool definition object. This gives you full control - you can run any logic in the execute callback, access application state, make API calls, or trigger navigation.

Here's a simple example - a tool that searches a product catalogue:

```js
await document.modelContext.registerTool({
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
    annotations: {
        readOnlyHint: true,
    },
    execute: async ({ query, category, maxPrice }, { signal }) => {
        const results = await searchProducts({ query, category, maxPrice }, { signal });

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

- **`name`** - A unique identifier for the tool. Agents use this to call it. Registering a second tool with the same name rejects.
- **`description`** - A natural language description of what the tool does. This is what the agent reads to decide whether to use it.
- **`inputSchema`** - A JSON Schema object describing the expected parameters. The agent uses this to construct valid inputs.
- **`execute`** - An async callback that runs when the agent calls the tool. It receives the parameters as its first argument and an options object containing an `AbortSignal` as its second, and must return a result in the MCP content format: `{ content: [{ type: "text", text: "..." }] }`.
- **`annotations`** - Optional hints about how the tool behaves (more on these below).
- **`title`** - An optional human-friendly display name, useful for browser UI that shows the user which tool an agent wants to run.

Note the `await`. `registerTool()` now returns a promise, and that promise is how you find out that your registration was rejected - for example because the name is already taken. If you're registering at module scope and can't use `await`, at least attach a `.catch()`, otherwise failures disappear silently:

```js
void document.modelContext.registerTool(tool).catch(console.error);
```

If something goes wrong inside the tool itself, you signal an error by adding `isError: true` to the response:

```ts
return {
    content: [{ type: "text", text: JSON.stringify({ error: "Item not found" }) }],
    isError: true,
};
```

### Annotations: Telling the Agent How Your Tool Behaves

Annotations are hints that help an agent - and the browser - decide how carefully to treat a tool. All three are optional and default to `false`:

- **`readOnlyHint`** - The tool only reads; it doesn't change any state. Safe for an agent to call speculatively.
- **`consequentialHint`** - The tool does something with real consequences (placing an order, sending an email, deleting a record). An agent should confirm with the user first.
- **`untrustedContentHint`** - The tool's output may contain content the site doesn't control, such as user-generated text. This is a prompt-injection warning to the agent.

These matter more than they look. `consequentialHint` is the difference between an agent quietly booking a table and an agent asking you first.

### Unregistering Tools

This is one of the pieces that changed along with the move to `document`. The old `unregisterTool()`, `provideContext()` and `clearContext()` methods are gone. Unregistration now goes through a standard `AbortSignal`, which is passed as a registration option:

```js
const controller = new AbortController();

await document.modelContext.registerTool(tool, { signal: controller.signal });

// Later - when the component unmounts, or the user logs out
controller.abort();
```

This is a much nicer fit for component frameworks: you create one `AbortController` per component, register whatever tools that component owns, and abort it on teardown. No bookkeeping of tool names.

The registration options object also accepts **`exposedTo`** - an array of secure origins that are allowed to see the tool. That's how you expose a tool to an embedding parent page without exposing it to everyone.

### Discovering and Calling Tools From the Page

`document.modelContext` isn't only for registering. A page (or a test) can also inspect and invoke what's registered:

```js
// Every tool currently registered, alphabetically ordered
const tools = await document.modelContext.getTools();

// Call one directly, without an agent in the loop
const result = await document.modelContext.executeTool(tools[0], { query: "blue jacket" });

// React when the available tools change
document.modelContext.addEventListener("toolchange", async () => {
    console.log(await document.modelContext.getTools());
});
```

`getTools()` also accepts a `fromOrigins` option for retrieving tools exposed by cross-origin frames, which need an `allow="tools"` permissions policy on the iframe.

I use `getTools()` constantly while developing - dropping it into the console is the fastest way to confirm that a tool actually registered and that its schema looks the way you expected.

## The Declarative API

The Declarative API is the zero-JavaScript approach. If you have an existing HTML form, you can turn it into a WebMCP tool by adding a couple of attributes:

```html
<form
    toolname="reserve_table"
    tooldescription="Reserve a table at the restaurant"
    toolautosubmit
    action="/reservations"
>
    <label for="date">Date</label>
    <input type="date" name="date" id="date" toolparamdescription="Reservation date" required />

    <label for="guests">Number of Guests</label>
    <input
        type="number"
        name="guests"
        id="guests"
        toolparamdescription="How many people the table is for"
        min="1"
        max="20"
        required
    />

    <label for="name">Your Name</label>
    <input type="text" name="name" id="name" toolparamdescription="Name for the booking" required />

    <button type="submit">Reserve</button>
</form>
```

The attributes are:

- **`toolname`** - The name of the tool (required). The browser uses this as the tool identifier.
- **`tooldescription`** - A natural language description of what the form does (required). The agent reads this to decide when to use it.
- **`toolparamdescription`** - Goes on an individual form control, and becomes the description of that property in the generated JSON Schema. This is the one I'd least like to skip: field names like `qty` or `dt` mean nothing to a model on their own.
- **`toolautosubmit`** - When present, the form is submitted automatically once the agent has filled it in. Without it, the agent fills the form and the user submits.

The browser automatically translates the form fields into a JSON Schema based on the `<input>` types, `name` attributes, and validation constraints (`required`, `min`, `max`, etc.). No JavaScript needed. Removing `toolname` or `tooldescription` unregisters the tool again, which means you can toggle a tool on and off with nothing but an attribute binding.

When an agent invokes the tool, the browser brings the form into focus and fills it in **in front of the user** - the form stays visible, so nothing happens invisibly in the background.

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

Both deactivate once the form submits, the agent cancels, or the user resets the form. This gives users visual feedback that an AI agent is interacting with the page - a nice touch for transparency.

### Reacting to the Agent in JavaScript

Declarative doesn't mean you're locked out of the lifecycle. There are events for the interesting moments:

```js
window.addEventListener("toolactivated", (event) => {
    console.log(`Agent filled in the form for: ${event.toolName}`);
});

window.addEventListener("toolcancel", () => {
    console.log("The user cancelled the agent's action");
});

form.addEventListener("submit", (event) => {
    if (!event.agentInvoked) return;

    // Hand a structured result back to the model instead of a page of HTML
    event.respondWith(
        fetch("/reservations", { method: "POST", body: new FormData(form) }).then((response) => response.json()),
    );
});
```

`SubmitEvent.agentInvoked` tells you the submission came from an agent rather than a human click, and `respondWith()` lets you pass a promise whose result is serialised back to the model. Without it, all the agent learns is that a navigation happened.

### A Note on Testing the Declarative API

> This section used to say the Declarative API couldn't be tested at all. That is no longer true - but there's still a catch worth knowing about.

The form-to-tool translation is a **native browser feature**: Chrome parses the DOM, detects the annotated forms, and registers them as tools itself. So with the origin trial or the local testing flag enabled (both covered in the next section), declarative forms genuinely work, and you'll see them listed in the Chrome DevTools WebMCP panel alongside your imperative tools.

What still doesn't work is testing them through a **polyfill**. The `@mcp-b/global` runtime implements the imperative side of the specification - `registerTool()`, `getTools()`, `executeTool()` - but it does not scan the DOM for `toolname` and `tooldescription` attributes. If you're relying on the polyfill because you're on a browser without native WebMCP, only your imperative tools will show up.

The practical advice hasn't changed: add the declarative attributes to your forms now. They cost nothing, and they work the moment a visitor arrives with native support.

## Setting Up WebMCP on Your Website

WebMCP is available in **Chrome from version 149** through an <a href="https://developer.chrome.com/blog/ai-webmcp-origin-trial" target="_blank" rel="noopener noreferrer">origin trial</a>, which is how you enable it for real visitors on your production domain. Register your origin, drop the token into a `<meta>` tag or an `Origin-Trial` header, and the API is live for everyone who visits with a supported Chrome.

For local development you don't need a token at all. Enable the dedicated flag:

1. Open `chrome://flags/#enable-webmcp-testing` in your browser
2. Set it to **Enabled**
3. Relaunch Chrome

> If you followed the original version of this article, note that both of these replaced the old advice. It used to be Chrome 146 behind the generic **"Experimental Web Platform features"** flag - there's now a WebMCP-specific flag, and an origin trial for production.

Microsoft has an <a href="https://developer.microsoft.com/en-us/microsoft-edge/origin-trials/trials/0b76fe60-b266-458e-a285-04e375c0c31a" target="_blank" rel="noopener noreferrer">origin trial of its own</a> running in **Edge 150**, so the same code works there. You can also join Chrome's <a href="https://developer.chrome.com/docs/ai/join-epp" target="_blank" rel="noopener noreferrer">early preview programme</a> for access to the full documentation and demos.

### Installing the Polyfill

Since WebMCP is still behind a trial and isn't in every browser, you'll want to use the `@mcp-b/global` runtime. It implements the WebMCP API and only activates when the browser doesn't provide it natively.

```bash
npm install @mcp-b/global
```

Then import it before registering your tools:

```ts
import "@mcp-b/global";

// Now document.modelContext is available
await document.modelContext.registerTool({
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

If you don't have a build step, there's an IIFE build you can drop in with a single script tag:

```html
<script src="https://unpkg.com/@mcp-b/global@latest/dist/index.iife.js"></script>
```

Either way, the runtime detects native browser support and defers to it when it exists, so the same code works in both polyfilled and native environments.

> Make sure you're on **`@mcp-b/global` v3 or later**. Versions 2.x and below still polyfill the old `navigator.modelContext`, which means agents looking for `document.modelContext` will find nothing at all. If you built a WebMCP integration earlier this year, this is the upgrade to do first.

## Testing Your WebMCP Tools

Now here's the fun part - actually testing your tools. This is the part of the article that has changed the most, and happily it's changed for the better: the first method below didn't exist when I originally wrote this.

### Method 1: The Chrome DevTools WebMCP Panel

No configuration, no MCP client, no npm packages. Open DevTools on a page that registers tools, click the **Application** tab, and select the **WebMCP** pane in the sidebar.

You get two things:

- **Available Tools** - every tool visible to an agent, with its description, its schema, and a counter showing how many times it has been invoked this session.
- **Invoked Tools** - a chronological log of every call, and for each one the status (Completed, Canceled, In Progress, Error), the exact **input** the agent predicted, and the **output** your tool returned.

That input/output log is the thing I reach for most. When an agent does something odd, it's almost always because the model guessed a parameter you didn't expect, and this is where you see the guess.

You can also run a tool yourself without an agent: click a tool in **Available Tools**, or hover a row in the log and click the **Play** (➜) icon. That's the fastest way to check that a tool works before you start worrying about whether a model understands it.

Full details are in the <a href="https://developer.chrome.com/docs/devtools/application/webmcp" target="_blank" rel="noopener noreferrer">Chrome DevTools WebMCP documentation</a>.

### Method 2: Chrome DevTools MCP (Recommended for AI Clients)

This is how you get a real agent - in VS Code, Claude Code, Cursor or Claude Desktop - to discover and call the tools on your page.

> **Correction to the original article.** I previously told you to use `@mcp-b/chrome-devtools-mcp` and specifically _not_ Google's `chrome-devtools-mcp`, because only the fork supported WebMCP discovery. That advice is now backwards. The WebMCP support has been upstreamed, and the official <a href="https://github.com/ChromeDevTools/chrome-devtools-mcp" target="_blank" rel="noopener noreferrer">`chrome-devtools-mcp`</a> is the one to use.

WebMCP is an experimental category in that server, so it's off unless you turn it on with `--categoryExperimentalWebmcp`:

```json
{
    "mcpServers": {
        "chrome-devtools": {
            "command": "npx",
            "args": ["-y", "chrome-devtools-mcp@latest", "--categoryExperimentalWebmcp=true"]
        }
    }
}
```

**Claude Code:**

```bash
claude mcp add chrome-devtools -- npx -y chrome-devtools-mcp@latest --categoryExperimentalWebmcp=true
```

**VS Code** (my preferred setup):

```bash
code --add-mcp '{"name":"chrome-devtools","command":"npx","args":["-y","chrome-devtools-mcp@latest","--categoryExperimentalWebmcp=true"]}'
```

**Claude Desktop** and **Cursor** take the same JSON as above - in `claude_desktop_config.json` and `.cursor/mcp.json` respectively.

With the flag on, your agent gets two extra tools:

| Tool                  | What it does                                           |
| --------------------- | ------------------------------------------------------ |
| `list_webmcp_tools`   | Lists all WebMCP tools the page exposes                |
| `execute_webmcp_tool` | Executes one of them, with JSON-stringified parameters |

(If you used the old fork: `call_webmcp_tool` is now `execute_webmcp_tool`.)

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

### Method 3: The Local Relay (For Desktop AI Clients)

Chrome DevTools MCP drives its own browser instance. Sometimes you want the opposite: the tab you already have open, with your session and your logged-in state, wired into Claude Desktop or Cursor. That's what <a href="https://docs.mcp-b.ai/how-to/connect-desktop-agents-with-local-relay" target="_blank" rel="noopener noreferrer">`@mcp-b/webmcp-local-relay`</a> does. It runs a small MCP server locally, your page connects to it over a WebSocket, and your desktop agent talks to it over stdio.

Add the server to your client:

```json
{
    "mcpServers": {
        "webmcp-local-relay": {
            "command": "npx",
            "args": ["-y", "@mcp-b/webmcp-local-relay@latest"]
        }
    }
}
```

Or, for Claude Code:

```bash
claude mcp add webmcp-local-relay -- npx -y @mcp-b/webmcp-local-relay@latest
```

Then add one script tag to the page you want to expose:

```html
<script src="https://cdn.jsdelivr.net/npm/@mcp-b/webmcp-local-relay@latest/dist/browser/embed.js"></script>
```

Anything already registered on `document.modelContext` is picked up automatically, and tools registered later are discovered through `toolchange` events - so script order doesn't matter. Your agent then gets `webmcp_list_sources` (which tabs are connected), `webmcp_list_tools` (what they expose), and the page's own tools as first-class MCP tools.

One gotcha: serve the page over HTTP, for example `http://localhost:3000`. Opening it as a `file:` URL gives it an opaque origin, and tool execution won't work.

### Other Tools Worth Knowing About

- **<a href="https://chromewebstore.google.com/detail/webmcp-model-context-tool/gbpdfapgefenggkahomfgkhfehlcenpd" target="_blank" rel="noopener noreferrer">Model Context Tool Inspector</a>** - a Chrome extension for manual and model-assisted tool inspection.
- **<a href="https://developer.chrome.com/docs/lighthouse/agentic-browsing/registered-webmcp-tools" target="_blank" rel="noopener noreferrer">Lighthouse agentic browsing audits</a>** - Lighthouse can now list the WebMCP tools it finds on a page and <a href="https://developer.chrome.com/docs/lighthouse/agentic-browsing/webmcp-schema-validity" target="_blank" rel="noopener noreferrer">flag invalid schemas</a>. Useful in CI.
- **<a href="https://pptr.dev/guides/webmcp" target="_blank" rel="noopener noreferrer">Puppeteer</a>** - programmatic discovery and invocation, if you want your tools covered by end-to-end tests.

## Who Actually Supports WebMCP

It's worth separating two very different questions: which **browsers implement** the API, and which **agents consume** the tools. The canonical, continuously updated answer lives in the spec repository's <a href="https://github.com/webmachinelearning/webmcp/blob/main/implementation-status.md" target="_blank" rel="noopener noreferrer">implementation status</a> page - don't trust a compatibility table you read somewhere (including this one) without checking it.

| Where               | Status                                                       |
| ------------------- | ------------------------------------------------------------ |
| **Chrome**          | Origin trial live from Chrome 149, plus a local testing flag |
| **Edge**            | Origin trial live from Edge 150                              |
| **ChatGPT Desktop** | Supported - the built-in browser can call site tools         |
| **Brave**           | Experimental support in Leo, Brave's AI chat                 |
| **Firefox, Safari** | Standards positions filed, no implementation yet             |

Frameworks are moving too: <a href="https://angular.dev/ai/webmcp" target="_blank" rel="noopener noreferrer">Angular has official experimental support</a>, and there are community integrations for React, Nuxt and others.

## Adding WebMCP to My Blog

To put all of this into practice, I added WebMCP to this blog. The goal was to let AI agents search articles, explore categories, find related content, and navigate the site - all through structured tools.

I built **six imperative tools** and added **declarative attributes** to two existing forms. Here's what each tool does:

### search_articles

Searches blog posts by keyword and/or category tag. The keyword matches against article titles, descriptions, and keywords. The category filter matches against article tags. Both parameters are optional - you can search by keyword only, category only, or both. Returns the count of matching articles along with their title, path, description, published date, read time, author, tags, and image.

### get_article

Gets the full details of a specific article by its path. You pass in the article path (e.g. `/2024/01/15/my-article-slug`) and it returns the article's title, description, image URL, tags, published date, read time, and author.

### list_categories

Lists all 25 blog categories with the number of articles in each. Takes no parameters. Returns an array of categories, each with a display name, URL path, and article count. This helps the agent understand what topics the blog covers before searching.

### get_recent_articles

Returns the most recently published blog posts. Accepts an optional `count` parameter (defaults to 5, maximum 10). Useful for agents that want to know what's new on the blog without searching for a specific topic.

### get_similar_articles

Finds articles semantically similar to a given article using AI-powered embeddings. You pass in an article path and it returns the 3 most related articles. Under the hood, it calls the blog's existing similarity API, which uses pre-generated vector embeddings and cosine similarity to find the closest matches.

### navigate_to

Navigates the browser to a specific page on the blog. Accepts any path - article pages, category listings, or special pages like `/about-me` and `/get-in-touch`. Returns a confirmation of the navigation. This lets the agent move the user to a relevant page after finding what they're looking for.

### Declarative Forms

I also added `toolname`, `tooldescription`, and `toolautosubmit` attributes to the **newsletter subscription** form (`subscribe_newsletter`) and the **contact** form (`send_message`). On a Chrome with WebMCP enabled these genuinely register - I can see `subscribe_newsletter` sitting alongside the six imperative tools in `document.modelContext.getTools()`, and I never wrote a line of JavaScript for it.

### How It's Actually Wired Up

This is the part I had to rebuild for this update, so it's worth showing properly.

The whole integration is two files plus the components that use it. First, a client-only Nuxt plugin that installs the runtime:

```ts
// app/plugins/webmcp.client.ts
import "@mcp-b/global";

export default defineNuxtPlugin(() => {});
```

The import is the entire job. `@mcp-b/global` auto-initialises on load, and it detects native browser support and steps aside when it finds it - on my Chrome, `document.modelContext.__isWebMCPPolyfill` is `false`, because the browser's own implementation is doing the work. The `.client.ts` suffix matters: this blog is statically generated, and there is no `document` to attach to during prerender.

Second, a composable that ties a tool's lifetime to the component that declares it:

```ts
// app/composables/useMcpTool.ts
export function useMcpTool(options: McpToolOptions) {
    let controller: AbortController | null = null;

    onMounted(() => {
        const modelContext = document.modelContext;
        if (!modelContext) return;

        controller = new AbortController();

        void modelContext.registerTool({ ...options }, { signal: controller.signal }).catch((error: unknown) => {
            console.error(`[WebMCP] Failed to register "${options.name}":`, error);
        });
    });

    onUnmounted(() => {
        controller?.abort();
        controller = null;
    });
}
```

That `AbortController` is the whole reason this update was necessary. The old version of this composable held on to a registration handle and called `registration.unregister()` on teardown. That method no longer exists - you create a controller, hand its signal to `registerTool`, and abort it when the component goes away. One controller per component, no tracking of tool names, and the browser does the cleanup.

Note the `.catch()`. Because `registerTool()` returns a promise now, a rejected registration - a duplicate name, most commonly - vanishes silently unless you handle it. I lost a good ten minutes to exactly that before adding the log line.

With those two files in place, a tool is one call anywhere in a component:

```ts
useMcpTool({
    name: "get_recent_articles",
    description: "Get the most recently published blog articles. Returns up to 10 articles sorted by date.",
    inputSchema: {
        type: "object",
        properties: {
            count: { type: "number", description: "Number of articles to return (default 5, max 10)" },
        },
    },
    execute: async (args) => {
        const count = Math.min(Math.max((args.count as number) || 5, 1), 10);
        const articles = await queryCollection("content")
            .where("blog", "=", "post")
            .order("path", "DESC")
            .limit(count)
            .all();

        return {
            content: [{ type: "text", text: JSON.stringify({ count: articles.length, articles }) }],
        };
    },
});
```

### A Note on `nuxt-mcp-b`

If you read the earlier version of this article, or my <NuxtLink to="/2026/03/15/how-to-create-a-nuxt-module-a-beginner-friendly-guide">guide to building a Nuxt module</NuxtLink>, you'll know I packaged this up as a reusable module called `nuxt-mcp-b`. **I've taken it back out of the blog, and I'd recommend you don't use it either.**

The reason is a good lesson in the cost of wrapping a fast-moving dependency. The module pinned `@mcp-b/global` at `^2.0.13`, and 2.x polyfills `navigator.modelContext`. When the API moved to `document.modelContext`, every agent started looking somewhere the module wasn't registering anything - so the tools were still there, technically, and completely undiscoverable. The wrapper that was meant to save me work became the thing standing between my site and a working integration.

Going direct to `@mcp-b/global` is barely more code than the module was - the two files above - and upgrading is now just a version bump. The module article is still worth reading if you want to learn how Nuxt modules are built; just don't install this particular one.

You can find the full WebMCP integration - the plugin, the composable, all six tool definitions and the status component - in the <a href="https://github.com/Suv4o/personal-blog-2023" target="_blank" rel="noopener noreferrer">blog's repository</a>.

## Looking Ahead

WebMCP is still a Draft Community Group Report - not a W3C standard, and explicitly subject to change. The rewrite this article just went through is the proof: in the space of a few months the API moved from `navigator` to `document`, three methods disappeared, annotations arrived, and the whole testing story was rebuilt. If you build on it now, expect to revisit your code.

But the direction is clear, and the churn is the good kind - the API is getting smaller and more conventional, not larger. `AbortSignal` instead of bespoke unregistration methods. A getter on the object it actually belongs to. Native DevTools support rather than third-party forks.

What excites me most is still the long-term vision. If WebMCP adoption grows and most websites start exposing structured tools, the way we interact with the web could fundamentally change. You wouldn't need to visit ten different airline websites to compare flight prices. You'd just ask your agent: _"Find me the cheapest flight to London next Friday"_ - and it would call `search_flights` on each airline's site, get structured results back, and give you a clean comparison in seconds.

We're still early, but this is the kind of infrastructure shift that makes the agentic web possible. If you build websites, I'd encourage you to start experimenting with WebMCP now. Add a few tools, open the DevTools WebMCP panel, and see how it feels. It takes an afternoon, and your tools keep working as browser support matures.
