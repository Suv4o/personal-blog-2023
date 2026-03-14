---
title: "How to Create a Nuxt Module: A Beginner-Friendly Guide"
description: A step-by-step guide to building a real, publishable Nuxt module from scratch, covering module architecture, client-side plugins, auto-imported composables, TypeScript support, and automation with agentic workflows.
image: https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_1200,e_sharpen:100/v1773227493/blog/how-to-create-a-nuxt-module-a-beginner-friendly-guide/how-to-create-a-nuxt-module-a-beginner-friendly-guide-2_kn1xkg
keywords:
    - Nuxt module
    - Nuxt.js
    - Vue.js
    - Nuxt module development
    - nuxt/kit
    - defineNuxtModule
    - Nuxt plugin
    - auto-imports
    - composables
    - runtimeConfig
    - client-side plugin
    - module builder
    - npm package
    - TypeScript
    - SSR
    - server-side rendering
    - WebMCP
    - mcp-b/global
    - agentic workflows
    - GitHub Actions
    - nuxi
    - Nuxt ecosystem
type: page
blog: post
published: 15th March 2026
readTime: 14
author: Aleksandar Trpkovski
articleTags:
    - Nuxt.js
    - Vue.js
    - TypeScript
---

# How to Create a Nuxt Module: A Beginner-Friendly Guide

_{{$document.published}} • {{$document.readTime}} min read - by **[{{$document.author}}](/)**_

::tag-pills{:tags="articleTags"}
::

![Landing Image](https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_750,e_sharpen:100/v1773227493/blog/how-to-create-a-nuxt-module-a-beginner-friendly-guide/how-to-create-a-nuxt-module-a-beginner-friendly-guide-2_kn1xkg)

If you've used Nuxt for any length of time, you've probably installed a few modules - `@nuxtjs/tailwindcss`, `@pinia/nuxt`, `nuxt-icon`. You add one line to your `modules` array, and everything just works: auto-imports, configuration, SSR handling, the lot. But have you ever looked inside one of those modules and wondered how they actually work? Or thought about building your own?

I had that exact thought recently. I needed to integrate a JavaScript library called <a href="https://www.npmjs.com/package/@mcp-b/global" target="_blank" rel="noopener noreferrer">`@mcp-b/global`</a> into a Nuxt project, and there was no existing module for it. So I built one. The process taught me that Nuxt module development is far more approachable than it looks from the outside - and I want to share what I learned.

In this article, we'll build a real, publishable Nuxt module together from scratch. Not a toy example - an actual module that's live on npm right now. By the end, you'll understand every piece of the architecture and feel confident building your own.

## Why I Wrote This

I've been following Vue.js and Nuxt.js very closely for several years now. If you're coming from the React world, the simplest way to think about it is this: **Nuxt is to Vue what Next.js is to React** - but in my experience, it's even better. The developer experience is remarkably polished, the community is great, and the framework stays out of your way while giving you everything you need.

What keeps me coming back, though, is the community. The Vue and Nuxt communities are some of the friendliest and most welcoming I've encountered in the JavaScript ecosystem. Whether you're asking a question on Discord, posting on Bluesky or X, opening an issue on GitHub, or browsing through the docs, you'll find people who genuinely want to help. That warmth has made a real difference in how I learn and build.

When I realised there was no Nuxt module for `@mcp-b/global`, I didn't just want to build one for myself - I wanted to document the process so others could learn from it too.

## A Quick Word on Vue and Nuxt

If you're not familiar with the ecosystem yet, here's the short version.

<a href="https://vuejs.org/" target="_blank" rel="noopener noreferrer">**Vue.js**</a> is a progressive JavaScript framework for building user interfaces. It's known for its gentle learning curve, excellent documentation, and a reactivity system that feels intuitive from day one. You write components using a <a href="https://vuejs.org/guide/scaling-up/sfc.html" target="_blank" rel="noopener noreferrer">single-file format</a> (`.vue` files) that keeps your template, script, and styles together in one place.

<a href="https://nuxt.com/" target="_blank" rel="noopener noreferrer">**Nuxt**</a> is a full-stack framework built on top of Vue. It adds <a href="https://nuxt.com/docs/guide/concepts/rendering#universal-rendering" target="_blank" rel="noopener noreferrer">server-side rendering</a>, <a href="https://nuxt.com/docs/getting-started/routing" target="_blank" rel="noopener noreferrer">file-based routing</a>, <a href="https://nuxt.com/docs/guide/concepts/auto-imports" target="_blank" rel="noopener noreferrer">auto-imports</a>, API routes, and a powerful <a href="https://nuxt.com/docs/guide/concepts/modules" target="_blank" rel="noopener noreferrer">module system</a>. Think of Vue as the engine and Nuxt as the car - Vue gives you the reactivity and component model, and Nuxt gives you everything else you need to build and deploy a production application.

The **module system** is one of Nuxt's most powerful features. Modules are functions that run when Nuxt starts up. They can register plugins, add composables, inject CSS, extend the build configuration, add server routes - essentially anything you might need to integrate a library or add functionality to your application. The Nuxt ecosystem has <a href="https://nuxt.com/modules" target="_blank" rel="noopener noreferrer">hundreds of community modules</a> that you can drop into your project with a single line of configuration.

## What We're Building

We're going to wrap <a href="https://www.npmjs.com/package/@mcp-b/global" target="_blank" rel="noopener noreferrer">`@mcp-b/global`</a> - a <a href="https://webmachinelearning.github.io/webmcp/" target="_blank" rel="noopener noreferrer">W3C Web Model Context API</a> polyfill that lets AI agents interact with your website - into a Nuxt module. The finished module will:

1. Auto-initialise the library on the client side
2. Provide auto-imported composables (`useMcpTool` and `useMcpB`)
3. Expose configuration options through `nuxt.config.ts`
4. Include full TypeScript support

The key thing about `@mcp-b/global` is that it's a **client-side library**. It polyfills `navigator.modelContext` in the browser so AI agents can discover and call tools on your website. This means our module needs to be careful about only running code in the browser - never during server-side rendering.

> You don't need to know anything about `@mcp-b/global` to follow along. The patterns we'll use apply to wrapping any JavaScript library into a Nuxt module.

## Prerequisites

Before we start, make sure you have:

- **Node.js** 24 or later
- **npm**, **yarn**, or **pnpm**

That's it. No special tooling required.

## Understanding the Two Worlds

Before we write any code, there's one concept that trips up almost everyone new to Nuxt module development. I want to explain it clearly because everything else builds on it.

A Nuxt module has **two separate worlds**:

1. **Build time** - code that runs when Nuxt starts up (your `module.ts` file)
2. **Application time** - code that runs inside the user's actual application (plugins, composables, components)

Your module definition (`module.ts`) runs at build time. It tells Nuxt: "Hey, register this plugin, add these composables, set up this configuration." It's like a set of instructions.

The files in the `runtime/` directory run at application time - in the user's browser or on their server. These are the plugins that initialise libraries, the composables that users call in their components, and any components your module provides.

These two worlds can't directly share variables or state. If your module receives configuration options at build time and your plugin needs them at application time, you need a bridge. That bridge is <a href="https://nuxt.com/docs/guide/going-further/runtime-config" target="_blank" rel="noopener noreferrer">**`runtimeConfig`**</a> - and we'll see exactly how it works shortly.

## The Module Structure

Here's what our finished module looks like:

```
nuxt-mcp-b/
├── src/
│   ├── module.ts                         # Module definition (build time)
│   ├── types.ts                          # Exported types
│   └── runtime/
│       └── app/
│           ├── plugins/
│           │   └── mcp-b.client.ts       # Client-only plugin (application time)
│           └── composables/
│               ├── useMcpB.ts            # Manual init/cleanup composable
│               └── useMcpTool.ts         # Tool registration composable
├── playground/
│   ├── nuxt.config.ts                    # Dev playground config
│   └── app.vue                           # Demo page
├── package.json
└── tsconfig.json
```

Two key directories to understand:

- **`src/`** contains the module definition and all the code that ships to users
- **`src/runtime/`** contains the code that runs inside the user's Nuxt application (plugins, composables, components)

This separation mirrors the two worlds I described above. `module.ts` is build time. Everything in `runtime/` is application time.

## Step 1: Setting Up the Project

Let's start by creating the `package.json`. The key fields for a Nuxt module are the `exports`, the `prepack` script (which builds the module), and the dependencies on `@nuxt/kit` and `@nuxt/module-builder`.

```json
{
    "name": "nuxt-mcp-b",
    "version": "0.1.0",
    "description": "Nuxt module for @mcp-b/global",
    "license": "MIT",
    "type": "module",
    "exports": {
        ".": {
            "import": "./dist/module.mjs"
        }
    },
    "main": "./dist/module.mjs",
    "files": ["dist"],
    "scripts": {
        "prepack": "nuxt-module-build build",
        "dev": "npx nuxi dev playground",
        "dev:prepare": "nuxt-module-build build --stub && nuxt-module-build prepare && npx nuxi prepare playground"
    },
    "dependencies": {
        "@mcp-b/global": "^2.0.13",
        "@nuxt/kit": "^4.3.1"
    },
    "devDependencies": {
        "@nuxt/module-builder": "^1.0.2",
        "@nuxt/schema": "^4.3.1",
        "nuxt": "^4.3.1",
        "typescript": "^5.9.3"
    }
}
```

A few things to note here:

- <a href="https://nuxt.com/docs/api/kit" target="_blank" rel="noopener noreferrer">**`@nuxt/kit`**</a> is a runtime dependency. It provides the utilities your module uses: `defineNuxtModule`, `addPlugin`, `addImports`, and `createResolver`
- <a href="https://github.com/nuxt/module-builder" target="_blank" rel="noopener noreferrer">**`@nuxt/module-builder`**</a> is a dev dependency. It compiles your TypeScript source into the `dist/` directory
- The **`exports`** field points to `./dist/module.mjs` - this is the compiled entry point that Nuxt loads when someone installs your module
- The **`prepack`** script runs `nuxt-module-build build`, which compiles everything before publishing
- The **`dev`** script starts a playground app so you can test your module during development
- The **`dev:prepare`** script stubs the module for development (so changes reflect immediately without rebuilding)

Run `npm install` to install everything.

## Step 2: The Module Definition

This is the heart of the module. The `src/module.ts` file uses `defineNuxtModule` from `@nuxt/kit` to declare what the module does when Nuxt starts up.

```ts
// src/module.ts
import { addImports, addPlugin, createResolver, defineNuxtModule } from "@nuxt/kit";

export interface TransportServerOptions {
    allowedOrigins?: string[];
    channelId?: string;
}

export interface TransportConfiguration {
    tabServer?: Partial<TransportServerOptions> | false;
    iframeServer?: Partial<TransportServerOptions> | false;
}

export interface ModuleOptions {
    autoInitialize?: boolean;
    transport?: TransportConfiguration;
    nativeModelContextBehavior?: "preserve" | "patch";
    installTestingShim?: boolean | "always" | "if-missing";
}

export default defineNuxtModule<ModuleOptions>({
    meta: {
        name: "nuxt-mcp-b",
        configKey: "mcpB",
        compatibility: {
            nuxt: ">=3.0.0",
        },
    },
    defaults: {
        autoInitialize: true,
        nativeModelContextBehavior: "preserve",
        installTestingShim: "if-missing",
    },
    setup(options, nuxt) {
        const resolver = createResolver(import.meta.url);

        // Pass module options to runtime via public runtimeConfig
        nuxt.options.runtimeConfig.public.mcpB = {
            autoInitialize: options.autoInitialize,
            transport: options.transport,
            nativeModelContextBehavior: options.nativeModelContextBehavior,
            installTestingShim: options.installTestingShim,
        };

        // Register the client-side plugin
        addPlugin({
            src: resolver.resolve("./runtime/app/plugins/mcp-b.client"),
            mode: "client",
        });

        // Register composables for auto-import
        addImports([
            {
                name: "useMcpB",
                from: resolver.resolve("./runtime/app/composables/useMcpB"),
            },
            {
                name: "useMcpTool",
                from: resolver.resolve("./runtime/app/composables/useMcpTool"),
            },
        ]);
    },
});
```

That's the entire module definition. Let's break it down piece by piece.

### The `meta` Object

```ts
meta: {
    name: "nuxt-mcp-b",
    configKey: "mcpB",
    compatibility: {
        nuxt: ">=3.0.0",
    },
},
```

- **`name`** is the module's identifier. It shows up in logs and dev tools
- **`configKey`** tells Nuxt which key in `nuxt.config.ts` holds this module's options. With `configKey: "mcpB"`, users configure the module like this:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
    modules: ["nuxt-mcp-b"],
    mcpB: {
        autoInitialize: true,
    },
});
```

- **`compatibility`** specifies which versions of Nuxt your module supports

### The `defaults` Object

```ts
defaults: {
    autoInitialize: true,
    nativeModelContextBehavior: "preserve",
    installTestingShim: "if-missing",
},
```

These are the default values for your module options. Nuxt merges them with whatever the user provides in their config. If a user doesn't specify `autoInitialize`, it defaults to `true`. This is important - **good defaults mean most users get a working module without any configuration at all**.

### The `setup` Function

This is where the real work happens. The `setup` function receives two arguments:

- **`options`** - the merged module options (your defaults + whatever the user configured)
- **`nuxt`** - the Nuxt instance, which gives you access to the full Nuxt configuration

Inside `setup`, we do three things. Let's look at each one.

**1. Pass options to runtime config**

```ts
nuxt.options.runtimeConfig.public.mcpB = {
    autoInitialize: options.autoInitialize,
    transport: options.transport,
    nativeModelContextBehavior: options.nativeModelContextBehavior,
    installTestingShim: options.installTestingShim,
};
```

Remember the two worlds? The `setup` function runs at build time, but our plugin needs these options at application time. <a href="https://nuxt.com/docs/guide/going-further/runtime-config#exposing-runtime-config" target="_blank" rel="noopener noreferrer">`runtimeConfig.public`</a> is the bridge - it serialises the values into the page so they're available in both server and client contexts.

**2. Register a plugin**

```ts
addPlugin({
    src: resolver.resolve("./runtime/app/plugins/mcp-b.client"),
    mode: "client",
});
```

`addPlugin` tells Nuxt to include our plugin file in the application. The `mode: "client"` flag is critical - it ensures the plugin only runs in the browser, not during server-side rendering. Since `@mcp-b/global` needs `window` and `navigator`, running it on the server would crash.

**3. Register composables**

```ts
addImports([
    {
        name: "useMcpB",
        from: resolver.resolve("./runtime/app/composables/useMcpB"),
    },
    {
        name: "useMcpTool",
        from: resolver.resolve("./runtime/app/composables/useMcpTool"),
    },
]);
```

`addImports` makes our composables available as <a href="https://nuxt.com/docs/guide/concepts/auto-imports" target="_blank" rel="noopener noreferrer">auto-imports</a> throughout the user's application. After this, users can write `useMcpTool(...)` in any component without importing anything manually. This is one of the things that makes Nuxt modules feel so seamless.

### Why `createResolver` Matters

```ts
const resolver = createResolver(import.meta.url);
resolver.resolve("./runtime/app/plugins/mcp-b.client");
```

Here's something that confused me at first. Why can't we just use a regular relative path like `"./runtime/app/plugins/mcp-b.client"`?

The problem is that when your module is installed in someone else's project, it lives deep inside `node_modules/`. A plain relative path would resolve relative to the user's project root - not your module's directory. `createResolver` creates a path resolver anchored to your module file's location, so paths always resolve correctly regardless of where the module is installed.

This is a small detail, but it will save you hours of debugging if you remember it from the start.

## Step 3: The Client Plugin

The plugin is the runtime code that actually initialises `@mcp-b/global` when the page loads in the browser.

```ts
// src/runtime/app/plugins/mcp-b.client.ts
import { initializeWebModelContext } from "@mcp-b/global";
import { defineNuxtPlugin, useRuntimeConfig } from "#imports";

export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig();
    const options = config.public.mcpB as {
        autoInitialize?: boolean;
        transport?: Record<string, unknown>;
        nativeModelContextBehavior?: "preserve" | "patch";
        installTestingShim?: boolean | "always" | "if-missing";
    };

    if (options?.autoInitialize === false) {
        return;
    }

    initializeWebModelContext({
        transport: options?.transport as Parameters<typeof initializeWebModelContext>[0]["transport"],
        nativeModelContextBehavior: options?.nativeModelContextBehavior,
        installTestingShim: options?.installTestingShim,
    });
});
```

A few things worth noting here:

**The file name ends with `.client.ts`.** This is a <a href="https://nuxt.com/docs/guide/directory-structure/plugins#plugin-registration-order" target="_blank" rel="noopener noreferrer">Nuxt convention</a> - files with `.client` in the name only run in the browser. Combined with the `mode: "client"` we set in `addPlugin`, we get double protection against SSR execution. I like having both because it makes the intent explicit.

**We read options from `runtimeConfig`.** This is the other end of the bridge we set up in `module.ts`. The options were serialised into the page at build time, and now we read them back at application time.

**We check `autoInitialize`.** If the user has set `autoInitialize: false` in their config, the plugin does nothing. This leaves manual initialisation to the user via the `useMcpB` composable - a flexibility that some users need.

**We import from <a href="https://nuxt.com/docs/guide/concepts/auto-imports#auto-imported-components" target="_blank" rel="noopener noreferrer">`#imports`</a>.** This is a Nuxt-specific import alias that gives you access to framework utilities like <a href="https://nuxt.com/docs/guide/directory-structure/plugins#creating-plugins" target="_blank" rel="noopener noreferrer">`defineNuxtPlugin`</a> and <a href="https://nuxt.com/docs/api/composables/use-runtime-config" target="_blank" rel="noopener noreferrer">`useRuntimeConfig`</a>. It only works inside `runtime/` files - not in your `module.ts`.

## Step 4: The Composables

Composables are reusable functions that follow Vue's <a href="https://vuejs.org/guide/extras/composition-api-faq.html" target="_blank" rel="noopener noreferrer">Composition API</a> patterns. We provide two of them, each serving a different use case.

### `useMcpTool` - Register Tools with Lifecycle Management

This is the composable most users will reach for. It registers an MCP tool when a component mounts and automatically unregisters it when the component unmounts. No cleanup code required.

```ts
// src/runtime/app/composables/useMcpTool.ts
import { onMounted, onUnmounted } from "vue";

interface ToolContent {
    type: string;
    text: string;
}

interface ToolResponse {
    content?: ToolContent[];
    isError?: boolean;
    [key: string]: unknown;
}

interface ToolInputSchema {
    type: "object";
    properties: Record<string, unknown>;
    required?: string[];
}

interface McpToolOptions {
    name: string;
    description: string;
    inputSchema: ToolInputSchema;
    execute: (args: Record<string, unknown>) => Promise<ToolResponse>;
}

export function useMcpTool(options: McpToolOptions): void {
    let unregister: (() => void) | null = null;

    onMounted(() => {
        if (typeof navigator === "undefined" || !navigator.modelContext) {
            return;
        }

        const registration = navigator.modelContext.registerTool({
            name: options.name,
            description: options.description,
            inputSchema: options.inputSchema,
            execute: options.execute,
        });

        unregister = () => registration.unregister();
    });

    onUnmounted(() => {
        unregister?.();
        unregister = null;
    });
}
```

Let's walk through what's happening here.

The **interfaces at the top** define the shape of the tool options. `McpToolOptions` is the main one - it requires a `name`, `description`, `inputSchema` (a JSON Schema for the tool's input parameters), and an `execute` function that runs when the tool is called.

The **`typeof navigator === "undefined"` guard** is important. Even though our plugin is client-only, this composable could theoretically be called during SSR if someone uses it incorrectly. The guard prevents a crash by silently returning if `navigator` doesn't exist.

The <a href="https://vuejs.org/api/composition-api-lifecycle.html#onmounted" target="_blank" rel="noopener noreferrer">**`onMounted`**</a> / <a href="https://vuejs.org/api/composition-api-lifecycle.html#onunmounted" target="_blank" rel="noopener noreferrer">**`onUnmounted`**</a> pattern ties the tool's lifecycle to the component's lifecycle. When the component mounts in the browser, the tool gets registered. When the component unmounts (the user navigates away, the component is conditionally removed, etc.), the tool gets unregistered. This prevents memory leaks and stale tool registrations.

Using it in a component is straightforward:

```ts
<script setup lang="ts">
useMcpTool({
    name: "get-page-title",
    description: "Returns the current page title",
    inputSchema: { type: "object", properties: {} },
    execute: async () => ({
        content: [{ type: "text", text: document.title }],
    }),
});
</script>
```

No imports needed. Nuxt auto-imports `useMcpTool` because we registered it with `addImports` in our module setup.

### `useMcpB` - Manual Lifecycle Control

For cases where users need direct control over initialisation and cleanup:

```ts
// src/runtime/app/composables/useMcpB.ts
import { initializeWebModelContext, cleanupWebModelContext } from "@mcp-b/global";
import type { WebModelContextInitOptions } from "@mcp-b/global";

export function useMcpB() {
    return {
        initialize: (options?: WebModelContextInitOptions) => initializeWebModelContext(options),
        cleanup: () => cleanupWebModelContext(),
    };
}
```

This is a thin wrapper - just five lines of actual code. But it's valuable because it's auto-imported and gives users a clean API without needing to know about `@mcp-b/global`'s internal exports. A user can simply write:

```ts
<script setup lang="ts">
const { initialize, cleanup } = useMcpB();

// Re-initialize with custom options
initialize({
    transport: {
        tabServer: { allowedOrigins: ["https://example.com"] },
    },
});

// Clean up when done
onUnmounted(() => cleanup());
</script>
```

## Step 5: The Development Playground

We need a way to try our module during development. Nuxt modules typically include a `playground/` directory - a minimal Nuxt application that imports the module directly from source.

```ts
// playground/nuxt.config.ts
export default defineNuxtConfig({
    modules: ["../src/module"],
    mcpB: {
        autoInitialize: true,
    },
    compatibilityDate: "2025-01-01",
});
```

```html
<!-- playground/app.vue -->
<template>
    <div>
        <h1>nuxt-mcp-b Playground</h1>
        <p>Open the browser console to verify the module is working.</p>
    </div>
</template>
```

Run `npm run dev:prepare` once to stub the module, then `npm run dev` to start the playground. You'll have a live Nuxt app running your module - any changes you make to the source files will reflect immediately.

## Why Build a Module Instead of Just Using the Library Directly?

This is a fair question. You could absolutely just `npm install @mcp-b/global` and write a plugin manually. Here's what a module gives you on top of that:

- **Zero-config setup** - users add one line to their `modules` array and everything works. No plugin files to create, no composables to manually import
- **Auto-imported composables** - `useMcpTool` and `useMcpB` are available everywhere without import statements
- **Proper SSR handling** - the module ensures client-only code never runs on the server. Users don't have to think about this
- **Centralised configuration** - all options live in `nuxt.config.ts` alongside everything else, with TypeScript autocomplete
- **Ecosystem discoverability** - published modules appear on <a href="https://nuxt.com/modules" target="_blank" rel="noopener noreferrer">nuxt.com/modules</a> and can be installed with `npx nuxi module add`

The difference between `npm install @mcp-b/global` and `npm install nuxt-mcp-b` is the difference between "here's a library, figure out how to integrate it" and "add this to your modules array and you're done."

## Patterns Worth Remembering

If you're planning to build your own Nuxt module, here are the patterns I found most important:

1. **Use `createResolver(import.meta.url)`** - always resolve paths relative to your module file, not the user's project root. This is the number one thing that will bite you if you forget it
2. **Client-only code goes in `.client.ts` files** - and use `mode: "client"` in `addPlugin` for extra safety. Belt and braces
3. **Pass build-time options to runtime via `runtimeConfig`** - the `setup` function and runtime code live in different worlds. `runtimeConfig.public` is the bridge between them
4. **Prefix your composables** - `useMcpTool` is better than `useTool` to avoid naming conflicts with other modules or the user's own code
5. **Provide sensible defaults** - most users should get a working module without any configuration. If `autoInitialize: true` is the common case, make it the default

## Automating the Module with Agentic Workflows

Building the module is one thing. Keeping it alive is another.

Once `nuxt-mcp-b` was published on npm, I immediately ran into the same maintenance burden every open-source author knows: version bumps, release scripts, checking whether the upstream library has changed, updating dependencies. None of it is difficult - it's just tedious and easy to forget. So I automated it.

I used <NuxtLink to="/2026/02/22/agentic-workflows-write-github-actions-in-markdown">GitHub Agentic Workflows</NuxtLink> - a relatively new feature that lets you write GitHub Actions in plain Markdown instead of YAML. Instead of scripting every step yourself, you describe what you want in natural language and an AI agent figures out how to do it. The workflow files live in `.github/workflows/` just like regular Actions, but with a `.md` extension.

I wrote <NuxtLink to="/2026/02/22/agentic-workflows-write-github-actions-in-markdown">a separate article</NuxtLink> explaining how agentic workflows work in detail - the frontmatter configuration, safe outputs, compilation, security model, and a full set of practical examples. If you're new to the concept, I'd recommend reading that first. Here, I'll focus on the two specific workflows I created for this module and why.

### Auto Release

The first workflow triggers every time code is pushed to the `main` branch. The agent reads the recent commit history, inspects what changed, and determines whether a new release is needed - and if so, whether it should be a patch, minor, or major version bump.

The decision follows standard semantic versioning rules. If someone changed a composable's public API in a breaking way, that's a major bump. A new configuration option or a new composable is a minor bump. A bug fix, a dependency update, or a refactor that doesn't touch the public surface is a patch. And if the only changes are to markdown files or formatting configuration, the agent skips the release entirely - there's nothing new to publish.

When a release is warranted, the agent edits `package.json` to bump the version, runs the build and publish script inside a sandboxed environment using the npm token, and then opens a pull request back to `main` with the version change. That PR keeps the repository in sync with what was published. The whole process happens without any manual intervention.

The key thing that makes this safe is the **safe outputs** model. The agent itself never gets direct write access to the repository. It can read code, edit files in its sandbox, and run commands - but the only way it can affect the outside world is through pre-approved channels: creating a pull request or opening an issue. If the publish fails, it creates an issue reporting the problem instead. There's no scenario where the agent silently breaks something.

### Monthly Dependency Monitor

The second workflow runs on a schedule - once a month, on the first of the month. Its job is to check whether the upstream `@mcp-b/global` package has released new features, breaking changes, or updates that our module needs to accommodate.

The agent checks four sources: the <a href="https://www.npmjs.com/package/@mcp-b/global" target="_blank" rel="noopener noreferrer">npm package page</a>, the <a href="https://github.com/WebMCP-org/npm-packages" target="_blank" rel="noopener noreferrer">GitHub repository</a> where `@mcp-b/global` is developed, the <a href="https://github.com/WebMCP-org/npm-packages/blob/main/packages/global/CHANGELOG.md" target="_blank" rel="noopener noreferrer">changelog</a> for the package, and the <a href="https://docs.mcp-b.ai/packages/global/overview" target="_blank" rel="noopener noreferrer">official documentation</a>. It compares what it finds against our current implementation - our `module.ts`, our plugin, our composables, our `package.json` version constraint.

If code changes are needed - say `@mcp-b/global` added a new configuration option we should expose, or changed a function signature we rely on - the agent creates a pull request with the necessary updates. I'm set as a reviewer on the PR, so I get notified and can review the changes before merging.

If there's a new upstream version but it doesn't affect our module (internal changes, bug fixes in code paths we don't touch), the agent creates an issue documenting what it found and why no code changes are needed. And if nothing has changed at all, it does nothing.

This workflow has been genuinely useful. Before setting it up, I'd occasionally check the upstream repo manually and wonder if I'd missed anything. Now I don't have to think about it - the monitor does the checking and tells me when something needs my attention.

### Why This Matters for Module Authors

If you're publishing an npm package that wraps an external library, you're effectively taking on a dependency relationship with that library's maintainers. When they ship updates, your users expect your module to keep up. Automating both the release process and the dependency monitoring means you can maintain a module responsibly without it becoming a second job.

The agentic workflows approach is particularly well-suited to this because the instructions are written in plain English. You don't need to learn a specialised CI scripting language - you describe the logic ("analyse commits, determine semver bump, publish if needed") and the agent handles the implementation. If you want to set this up for your own module, I covered the full technical details - frontmatter configuration, safe outputs, compilation, and more - in my <NuxtLink to="/2026/02/22/agentic-workflows-write-github-actions-in-markdown">agentic workflows article</NuxtLink>.

## Conclusion

Building a Nuxt module is more approachable than it looks. At its core, it's a `setup` function that registers plugins, composables, and configuration using the utilities from <a href="https://nuxt.com/docs/api/kit" target="_blank" rel="noopener noreferrer">`@nuxt/kit`</a>. The architecture follows a clear pattern: module definition at build time, runtime code at application time, and `runtimeConfig` bridging the two. If you want to dive deeper, the official <a href="https://nuxt.com/docs/guide/going-further/modules" target="_blank" rel="noopener noreferrer">Nuxt Module Author Guide</a> is an excellent next step.

What I find most satisfying about this process is the shift in perspective. You stop thinking about "how do I use this library in my project?" and start thinking about "how would I want someone to use this library?" That mindset produces better APIs and better developer experiences - whether you're wrapping an existing package or building something entirely new.

And once you've built it, automating the maintenance with agentic workflows means the module stays healthy without constant manual attention. The combination of a well-structured module and smart automation is what turns a side project into something you can confidently publish and maintain.

You can find the complete source code for `nuxt-mcp-b` on <a href="https://github.com/Suv4o/nuxt-mcp-b" target="_blank" rel="noopener noreferrer">GitHub</a>, and the published module on <a href="https://www.npmjs.com/package/nuxt-mcp-b" target="_blank" rel="noopener noreferrer">npm</a>.
