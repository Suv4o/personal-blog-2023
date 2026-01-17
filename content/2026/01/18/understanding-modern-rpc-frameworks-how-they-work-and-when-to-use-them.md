---
title: "Understanding Modern RPC Frameworks: How They Work and When to Use Them"
description: Explore modern RPC frameworks and learn how they differ from REST. This comprehensive guide covers plain RPC, JSON-RPC, gRPC, tRPC, and oRPC with practical examples. Discover when to use RPC over REST, understand end-to-end type safety, and see how modern tools like tRPC and oRPC simplify full-stack TypeScript development while gRPC excels in microservices architecture.
image: https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_1200,e_sharpen:100/v1768564822/blog/understanding-modern-rpc-frameworks-how-they-work-and-when-to-use-them/understanding-modern-rpc-frameworks-how-they-work-and-when-to-use-them_pkdooe
keywords:
    - RPC frameworks
    - Remote Procedure Call
    - REST vs RPC
    - gRPC
    - tRPC
    - oRPC
    - JSON-RPC
    - Protocol Buffers
    - end-to-end type safety
    - TypeScript RPC
    - microservices communication
    - API design
    - HTTP/2
    - Node.js RPC
    - full-stack TypeScript
    - OpenAPI
    - Zod validation
    - type-safe APIs
    - client-server communication
    - modern web architecture
type: page
blog: post
published: 18th January 2026
readTime: 13
author: Aleksandar Trpkovski
articleTags:
    - TypeScript
    - Node.js
    - Tech
---

# Understanding Modern RPC Frameworks: How They Work and When to Use Them

_{{$document.published}} • {{$document.readTime}} min read — by **[{{$document.author}}](/)**_

::tag-pills{:tags="articleTags"}
::

::audio-player{:audioSrc="https://cdn.jsdelivr.net/gh/Suv4o/personal-blog-2023/audio-summary/2026/01/18/understanding-modern-rpc-frameworks-how-they-work-and-when-to-use-them/summary.mp3" :transcriptSrc="https://cdn.jsdelivr.net/gh/Suv4o/personal-blog-2023/audio-summary/2026/01/18/understanding-modern-rpc-frameworks-how-they-work-and-when-to-use-them/summary.json"}
::

![Landing Image](https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_750,e_sharpen:100/v1768564822/blog/understanding-modern-rpc-frameworks-how-they-work-and-when-to-use-them/understanding-modern-rpc-frameworks-how-they-work-and-when-to-use-them_pkdooe)

When building a web application where the frontend needs to communicate with the backend, we almost always reach for <a href="https://en.wikipedia.org/wiki/REST" target="_blank" rel="noopener noreferrer">REST</a>. It's what we know best, well-documented and works beautifully with the browser's `fetch` API using HTTP methods like `GET`, `POST`, `PUT`, and `DELETE`.

Client-server communication typically means creating <a href="https://en.wikipedia.org/wiki/Create,_read,_update_and_delete" target="_blank" rel="noopener noreferrer">CRUD</a> API endpoints, passing parameters in requests, and handling responses from the server.

## A Brief Look at REST

You're probably already familiar with REST - most of us are. Since we're here to talk about RPC, we won't spend much time on this. But it's worth briefly revisiting REST to understand why RPC might be a compelling alternative.

REST has dominated web API design since the early 2000s, when <a href="https://en.wikipedia.org/wiki/Roy_Fielding" target="_blank" rel="noopener noreferrer">_Roy Fielding_</a> introduced it in his doctoral dissertation. It quickly became the standard for client-server communication, and for good reason: it's simple, leverages standard HTTP methods, and works seamlessly with browsers.

## How REST Works

Let's walk through a simple example: adding two numbers.

> All examples in this article use TypeScript in Node.js - my primary language and what I work with daily. Feel free to adapt these concepts to whatever language you're most comfortable with. The principles remain the same.

### REST Server

```ts
import http from "http";

http.createServer((req, res) => {
    if (req.method === "POST" && req.url === "/calculate") {
        let body = "";

        req.on("data", (chunk) => (body += chunk));
        req.on("end", () => {
            const { a, b } = JSON.parse(body);
            res.end(JSON.stringify({ result: a + b }));
        });
    }
}).listen(3000, () => {
    console.log("REST server running on http://localhost:3000");
});
```

### REST Client

```ts
fetch("http://localhost:3000/calculate", {
    method: "POST",
    body: JSON.stringify({ a: 2, b: 3 }),
})
    .then((res) => res.json())
    .then((data) => console.log("Result:", data.result));
```

The key distinction is that REST thinks in terms of **resources**. Instead of saying "call the add function," you're saying "send a calculation request to the server."

Here's what's happening behind the scenes:

1. We send an HTTP POST request to `/calculate`
2. The request body contains JSON data: `{ a: 2, b: 3 }`
3. The server receives the request and parses the JSON
4. The server performs the calculation
5. The server sends back a JSON response: `{ result: 5 }`

REST works great for many things. It's human-readable, browser-friendly, and uses standard HTTP methods.

![REST Client](https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_750,e_sharpen:100/v1768564821/blog/understanding-modern-rpc-frameworks-how-they-work-and-when-to-use-them/REST-Client_ien9yp.jpg)

### Where REST Can Feel Limiting

- **Complex logic requires multiple endpoints:** As your application grows, you need to create and maintain numerous API endpoints for different operations.
- **No built-in type safety:** REST doesn't provide type safety and often requires third-party documentation tools like <a href="https://www.openapis.org/" target="_blank" rel="noopener noreferrer">OpenAPI</a> to bridge the gap.
- **Resources instead of functions:** You work with resource representations rather than calling functions directly.
- **Verbose for simple operations:** Even straightforward tasks require HTTP boilerplate and JSON serialisation overhead.

RESTful APIs have proven reliable and work great for CRUD operations on resources. But what if you want a different approach - one where you simply call a function?

## There's Another Way: RPC

What if, instead of "sending a calculation request," you could simply **call a function** on the server as if it were right there in your code?

That's exactly what RPC (Remote Procedure Call) does. It lets you call a function on another machine just like you'd call a local function.

For example, here's how you'd call a local `add` function:

```ts
const result = await add(2, 3);
console.log(result); // 5
```

Simple, right? That's what RPC looks like. But before we dive into the code, let's explore how we got here.

![There's Another Way: RPC](https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_750,e_sharpen:100/v1768564822/blog/understanding-modern-rpc-frameworks-how-they-work-and-when-to-use-them/theres-another-way-rpc_aoirtg.jpg)

## RPC Isn't New

Here's something surprising: RPC is actually older than REST.

The idea was formalised in 1984 by _Andrew Birrell_ and _Bruce Jay Nelson_ at Xerox PARC. Their goal was ambitious yet simple: make calling a function on another machine feel exactly like calling a local function.

So yes - RPC has been around since the 1980s. But why are we hearing more about it lately?

## **RPC Through the Decades**

RPC has evolved through several distinct eras.

- **Late 1980s–1990s: Enterprise RPC**
    - <a href="https://en.wikipedia.org/wiki/Sun_RPC" target="_blank" rel="noopener noreferrer">Sun RPC</a>, <a href="https://en.wikipedia.org/wiki/DCE/RPC" target="_blank" rel="noopener noreferrer">DCE/RPC</a>, <a href="https://en.wikipedia.org/wiki/Common_Object_Request_Broker_Architecture" target="_blank" rel="noopener noreferrer">CORBA</a>
      _Used heavily in large, distributed enterprise systems_
- **Early 2000s: Web-Friendly RPC**
    - <a href="https://en.wikipedia.org/wiki/XML-RPC" target="_blank" rel="noopener noreferrer">XML-RPC</a>, <a href="https://en.wikipedia.org/wiki/SOAP" target="_blank" rel="noopener noreferrer">SOAP</a>
      _Widely adopted, but verbose and heavyweight_
- **2010s–today: Lightweight & Fast**
    - <a href="https://www.jsonrpc.org/" target="_blank" rel="noopener noreferrer">JSON-RPC</a> (simple and readable)
    - Modern frameworks like <a href="https://grpc.io/" target="_blank" rel="noopener noreferrer">gRPC</a>, <a href="https://trpc.io/" target="_blank" rel="noopener noreferrer">tRPC</a>, and <a href="https://orpc.dev/" target="_blank" rel="noopener noreferrer">oRPC</a> with end-to-end type safety

Early RPC systems were complex. Technologies like SOAP and XML-RPC were powerful but heavy and difficult to work with.

In the 2010s, things changed. Modern frameworks like gRPC, tRPC, and oRPC emerged - lightweight, fast, and easier to implement. They delivered speed with simple integration and, importantly, automatic type checking between client and server.

This made a big difference. Better tools made RPC easier to use, leading to wider adoption.

## Why RPC Is Growing in Popularity

Over the past decade, web application architecture has changed dramatically. As teams work with larger monorepos and distributed microservices, end-to-end type safety has become essential. This shift naturally led many teams toward RPC-based frameworks like gRPC, tRPC, and oRPC.

These tools bridge the gap between client and server. Instead of treating the backend as a distant HTTP interface, you call remote procedures like local functions. This eliminates the "parallel universes" problem where client and server APIs slowly drift out of sync.

RPC frameworks strike a practical balance - they combine the performance and reliability of strongly typed contracts with the simplicity of direct function calls.

gRPC approaches modern RPC from an infrastructure perspective. By defining services using Protocol Buffers, it enforces strong, language-agnostic contracts and enables fast, reliable communication between services. This makes gRPC ideal for internal microservices where performance, strict schemas, and cross-language support are critical.

tRPC takes a different approach. By leveraging TypeScript's type inference, the client consumes the server's router types directly. The result: rich autocompletion, compile-time validation, and a smooth developer experience.

oRPC offers a similar experience while staying compatible with OpenAPI. This makes it easier to expose RPC-style APIs to non-TypeScript clients and third-party integrations without sacrificing type safety.

## RPC in the AI Era

RPC has also found renewed relevance in the AI era. AI systems don't think in terms of resources - they think in terms of actions.

Modern AI agents don't just fetch data, they execute capabilities. They _search_, _calculate_, _read files_, _call tools_, and _chain decisions together_. This interaction model maps naturally to function invocation.

A clear example is the <a href="https://modelcontextprotocol.io/docs/getting-started/intro" target="_blank" rel="noopener noreferrer">Model Context Protocol</a> (MCP) **-** an open standard introduced in late 2024 to connect large language models with tools, data sources, and execution environments. Under the hood, MCP is fundamentally RPC-based, using JSON-RPC 2.0 as its core communication layer.

Instead of exposing resources, MCP exposes procedures:

- `tools/call`
- `resources/read`
- `prompts/get`
- `sampling/createMessage`

Each interaction is a structured remote function call with well-defined inputs, outputs, and error handling. This lets an AI agent treat external systems as extensions of its own runtime - much closer to calling a local function than issuing an HTTP request.

This pattern is becoming common across AI infrastructure:

- **Tool calling** is RPC by design - invoke a method with parameters, receive a result
- **Agent orchestration** relies on asynchronous, correlated procedure calls
- **Context retrieval** maps cleanly to callable capabilities
- **Bidirectional workflows** (where servers can request model outputs) require RPC-style messaging

RPC is becoming the **"system call layer" for AI**. Just as operating systems expose functions for applications to interact with hardware, AI platforms expose RPC interfaces for models to interact with the world.

## Understanding RPC Through Examples

Now that we understand what RPC is and why it matters, let's explore it by building the same simple example in different ways. We'll use the same function throughout:

`add(2, 3) → 5`

Nothing fancy - just enough to see how each approach works and what trade-offs it makes.

We'll start with the most basic RPC implementation and work our way up to modern, type-safe solutions.

## Plain RPC (No Standard, No Framework)

Let's start with the simplest possible RPC implementation. This is RPC in its purest form - no libraries, no standards, just the core idea.

### How It Works

The flow is straightforward:

1. We send the name of the function we want to call
2. We send the parameters for that function
3. The server finds the function and runs it
4. The server sends back the result

Let's see what this looks like in code.

### Plain RPC Server

```ts
import http from "http";

const methods: Record<string, (...args: number[]) => number> = {
    add: (a: number, b: number) => a + b,
};

http.createServer((req, res) => {
    let body = "";

    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
        const { method, params } = JSON.parse(body);
        const result = methods[method](...params);

        res.end(JSON.stringify({ result }));
    });
}).listen(3000, () => {
    console.log("Plain RPC server running on http://localhost:3000");
});
```

The server is refreshingly simple. It maintains a registry of available functions and when a request comes in, it looks up the function by name and executes it with the provided parameters.

### Plain RPC Client

```ts
const callRpc = async () => {
    const res = await fetch("http://localhost:3000", {
        method: "POST",
        body: JSON.stringify({
            method: "add",
            params: [2, 3],
        }),
    });

    const data = await res.json();
    console.log("Result:", data.result);
};

callRpc();
```

On the client side, we're just sending a JSON object with two fields: which method to call, and what parameters to pass. It's almost like calling a function, but over HTTP.

### What's Good About This

- It actually works! You can run this code right now
- It's easy to understand - there's no magic happening here
- Zero dependencies - just plain Node.js

### What's Not So Good

- No rules or standards - everyone could implement this differently
- No error handling - what happens when something goes wrong?
- No contracts - the client and server just have to "know" what methods exist and hope they agree
- If someone calls a method that doesn't exist... your app crashes

This implementation shows you the essence of RPC. It's raw and unpolished, but you can see the core concept clearly: calling a remote function almost like it's local.

Of course, you wouldn't want to use this in a real application. That's where standards and frameworks come in - which we'll explore next.

## JSON-RPC (Same Idea, Standardised)

JSON-RPC takes the plain RPC idea we just saw and wraps it in a formal specification. It was first introduced around 2005 and has evolved through several versions, with JSON-RPC 2.0 being the current standard.

The core concept is identical - call a remote function by name and pass parameters - but now there's structure around it.

### What JSON-RPC Adds

- A version identifier (`jsonrpc: "2.0"`)
- A standard request/response format
- Error handling conventions
- Request IDs for matching responses (useful for batch requests)

Let's see what this looks like in practice.

### JSON-RPC Request Format

```json
{
    "jsonrpc": "2.0",
    "method": "add",
    "params": [2, 3],
    "id": 1
}
```

Notice the structure. We're calling the same `add` function, but now it's wrapped in a standardised format that any JSON-RPC implementation can understand.

### JSON-RPC Response Format

```json
{
    "jsonrpc": "2.0",
    "result": 5,
    "id": 1
}
```

The response follows the same pattern - clean, predictable, and easy to parse.

### JSON-RPC Server

```ts
import http from "http";

const methods: Record<string, (...args: number[]) => number> = {
    add: (a: number, b: number) => a + b,
};

http.createServer((req, res) => {
    let body = "";

    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
        const { method, params, id } = JSON.parse(body);

        const result = methods[method](...params);

        res.end(
            JSON.stringify({
                jsonrpc: "2.0",
                result,
                id,
            })
        );
    });
}).listen(3000, () => {
    console.log("JSON-RPC server running on http://localhost:3000");
});
```

The server implementation looks almost identical to our plain RPC version. The main difference is that we're now following the JSON-RPC 2.0 format - adding the version identifier and including the request ID in our response.

### JSON-RPC Client

```ts
fetch("http://localhost:3000", {
    method: "POST",
    body: JSON.stringify({
        jsonrpc: "2.0",
        method: "add",
        params: [2, 3],
        id: 1,
    }),
})
    .then((res) => res.json())
    .then((data) => console.log("Result:", data.result));
```

The client also follows the standard format. We're sending the version, method name, parameters, and an ID to track the request.

### What's Good About This

- Everyone speaks the same language - any JSON-RPC client can talk to any JSON-RPC server
- Tooling and libraries are readily available across languages
- Error handling is standardized and predictable
- Batch requests are supported out of the box

### What's Not So Good

- Still no type safety - nothing stops you from calling `add("hello", "world")`
- You'll only discover type mismatches at runtime
- No automatic client generation from server code
- You're still manually constructing requests and parsing responses

JSON-RPC represents a significant step forward. It's simple enough to implement by hand but structured enough to be reliable and interoperable. It's been widely adopted and powers many production systems.

But there's still something missing: type safety. Modern development workflows expect the compiler to catch mistakes before runtime. That's where the next generation of RPC frameworks comes in.

## Modern RPC Frameworks

We've explored RPC in its foundational forms - plain RPC and JSON-RPC. Both demonstrate the core idea: calling remote functions by name and passing parameters over the network.

Modern tools take a different approach. Instead of treating RPC as just a message format, they treat it as a **contract-first or type-first system**. Client and server evolve together safely, catching mistakes at build time rather than in production.

This new generation falls into two categories:

- **Infrastructure-first RPC -** optimised for performance and cross-language systems (like gRPC)
- **Developer-experience-first RPC -** optimised for full-stack productivity and type safety (like tRPC and oRPC)

Let's look at how these tools approach RPC and what trade-offs each one makes.

## gRPC (Strong Contracts, High Performance)

gRPC was developed by Google and open-sourced in 2015. Many people assume the "g" stands for "Google," but the project has never officially committed to that meaning. Instead, it playfully assigns different expansions with each release - in **1.1**, the _g_ stood for **"good,"** in **1.2** for **"green,"** and in **1.76** for **"genuine."** You can see the full list on the gRPC <a href="https://grpc.github.io/grpc/cpp/md_doc_g_stands_for.html" target="_blank" rel="noopener noreferrer">documentation</a>.

### What Makes gRPC Different

gRPC introduces **contracts** through Protocol Buffers (protobuf). You define exactly what your service looks like in a `.proto` file before writing any code. This contract then generates code for both the server and client.

gRPC also uses HTTP/2 and binary serialization, making it significantly faster than JSON-based approaches.

### The Contract (calculator.proto)

```protobuf
syntax = "proto3";

service Calculator {
  rpc Add (AddRequest) returns (AddResponse);
}

message AddRequest {
  int32 a = 1;
  int32 b = 2;
}

message AddResponse {
  int32 result = 1;
}
```

This file defines a `Calculator` service with an Add method. It takes an `AddRequest` (with two integers) and returns an `AddResponse` (with one integer).

### gRPC Server

```ts
import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";

const def = protoLoader.loadSync("calculator.proto");
const proto = grpc.loadPackageDefinition(def) as any;

const server = new grpc.Server();

server.addService(proto.Calculator.service, {
    Add: (call: any, cb: any) => {
        const { a, b } = call.request;
        cb(null, { result: a + b });
    },
});

server.bindAsync("0.0.0.0:50051", grpc.ServerCredentials.createInsecure(), () => {
    console.log("gRPC server running on 0.0.0.0:50051");
});
```

### gRPC Client

```ts
import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";

const def = protoLoader.loadSync("calculator.proto");
const proto = grpc.loadPackageDefinition(def) as any;

const client = new proto.Calculator("localhost:50051", grpc.credentials.createInsecure());

client.Add({ a: 2, b: 3 }, (_: any, res: any) => {
    console.log("Result:", res.result);
});
```

### The Good

- **Strong contracts**: Both sides know exactly what to expect
- **Very fast**: Binary protocol over HTTP/2
- **Language-agnostic**: Generate clients in Python, Go, Java, and more from the same `.proto` file
- **Streaming support**: Built-in support for bidirectional streaming
- **Battle-tested**: Used by Google, Netflix, Slack, and many others

### The Not So Good

- **More setup**: Requires the proto file, code generation, and gRPC libraries
- **Less browser-friendly**: Browsers don't natively support gRPC (though <a href="https://www.npmjs.com/package/grpc-web" target="_blank" rel="noopener noreferrer">gRPC-Web</a> exists as a workaround)
- **Harder to debug**: Binary protocol means you can't just inspect it in the network tab
- **Learning curve**: Protocol Buffers syntax takes time to learn

gRPC shines when you need performance and type safety, especially for service-to-service communication where browsers aren't involved.

## tRPC (Modern TypeScript RPC)

**tRPC** is one of the newer approaches on this list, created by <a href="https://x.com/alexdotjs" target="_blank" rel="noopener noreferrer">Alex "KATT" Johansson</a> in 2021. It's built around a simple idea: if both your server and client are written in TypeScript, you can share types directly - eliminating the need for separate API schemas, code generation, or duplicated definitions.

### The tRPC Philosophy

tRPC keeps the RPC model but removes the boilerplate. No schemas. No generated clients. Just TypeScript.

You define your procedures on the server, export the type, and import it on the client. TypeScript's type inference handles the rest.

### tRPC Server

```ts
import { initTRPC } from "@trpc/server";
import { createHTTPServer } from "@trpc/server/adapters/standalone";

const t = initTRPC.create();

const appRouter = t.router({
    add: t.procedure
        .input((v: unknown) => v as [number, number])
        .query(({ input }) => {
            const [a, b] = input;
            return a + b;
        }),
});

export type AppRouter = typeof appRouter;

createHTTPServer({ router: appRouter }).listen(3000);

console.log("tRPC server running on http://localhost:3000");
```

### tRPC Client

```ts
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "./server.js";

const client = createTRPCProxyClient<AppRouter>({
    links: [
        httpBatchLink({
            url: "http://localhost:3000",
        }),
    ],
});

(async () => {
    const result = await client.add.query([2, 3]);
    console.log("Result:", result);
})();
```

### The Magic

See that `import type { AppRouter }`? That's the secret. The client imports only the **type** from the server - not the actual code. This means:

- Your IDE knows exactly what methods are available
- You get autocomplete for method names and parameters
- Type errors appear before you even run the code
- Refactor a procedure name, and TypeScript shows you everywhere it's used

### The Good

- **End-to-end type safety**: Change the server, and TypeScript tells you what broke on the client
- **No API duplication**: Define once, use everywhere
- **Feels like local functions**: `client.add.query([2, 3])` feels natural
- **Great developer experience**: Autocomplete, type checking, and refactoring support
- **Growing ecosystem**: Integrates well with React, Next.js, and other frameworks

### The Not So Good

- **TypeScript-only**: Both server and client must be TypeScript
- **Same codebase (sort of)**: Type sharing works best in monorepos or when you can share types
- **Newer**: Less battle-tested than gRPC, smaller community

tRPC is perfect for full-stack TypeScript applications where you control both ends.

## oRPC (Type Safety Meets OpenAPI)

oRPC is a newer TypeScript RPC framework that combines end-to-end type safety with native OpenAPI support. It's designed for developers who want type-safe APIs that also generate standard documentation.

### The oRPC Philosophy

Like tRPC, you define procedures on the server and import types on the client. Unlike tRPC, oRPC uses explicit schema validation (with Zod or other validators), which enables automatic OpenAPI generation.

### oRPC Server

```ts
import { createServer } from "node:http";
import { os } from "@orpc/server";
import { RPCHandler } from "@orpc/server/node";
import { z } from "zod";

const add = os.input(z.object({ a: z.number(), b: z.number() })).handler(async ({ input }) => {
    return input.a + input.b;
});

export const router = {
    add,
};

export type Router = typeof router;

const handler = new RPCHandler(router);

const server = createServer(async (req, res) => {
    const result = await handler.handle(req, res, {
        context: {},
    });

    if (!result.matched) {
        res.statusCode = 404;
        res.end("No procedure matched");
    }
});

server.listen(3000, "127.0.0.1", () => {
    console.log("oRPC server running on http://127.0.0.1:3000");
});
```

### oRPC Client

```ts
import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import type { Router } from "./server.js";

const link = new RPCLink({
    url: "http://127.0.0.1:3000",
});

const client = createORPCClient<Router>(link);

(async () => {
    const result = await client.add({ a: 2, b: 3 });
    console.log("Result:", result);
})();
```

### The Good

- **End-to-end type safety**: Like tRPC, change the server and TypeScript shows what broke
- **Native OpenAPI support**: Automatically generates API documentation from your schemas
- **Built-in schema validation**: Zod validates inputs at runtime, catching errors early
- **Multi-runtime**: Works on Node.js, Deno, Bun, and Cloudflare Workers
- **Explicit contracts**: Zod schemas serve as both documentation and validation

### The Not So Good

- **Requires schema definitions**: More verbose than tRPC's implicit typing
- **Newer framework**: Smaller community, less battle-tested

## **When Should You Use RPC vs. REST?**

By now, it should be clear that RPC and REST aren't competitors - they solve different problems and excel in different contexts. The right choice depends on your team structure, tooling, and the system you're building.

### **Use REST When:**

REST is an excellent choice when:

- **You're building public or third-party APIs** - REST is universally understood. Almost every language, tool, and platform speaks HTTP + JSON.
- **Your API is resource-oriented** - CRUD-heavy systems map naturally to REST:
    - `/users`
    - `/orders`
    - `/products/{id}`
- **You need strong browser compatibility** - REST works out of the box with `fetch`, dev tools, CDNs, caching layers, and proxies.
- **Your client and server evolve independently** - REST's looser coupling makes it easier to version APIs and support older clients.
- **You want simple caching and observability** - HTTP semantics (status codes, caching headers, proxies) work naturally with REST.

REST excels when stability, interoperability, and simplicity matter more than tight coupling or type precision.

### **Use RPC When:**

RPC becomes a better fit when:

- **You control both the client and the server** - This is especially true in monorepos or tightly coordinated teams.
- **Your API is action-oriented, not resource-oriented** - Operations like `calculateInvoice`, `recommendMovies`, or `validateCheckout` feel much more natural as function calls than as REST endpoints.
- **End-to-end type safety matters** - If runtime errors from API mismatches are costly, RPC frameworks like tRPC, oRPC, or gRPC dramatically reduce that risk.
- **Developer experience is a priority** - Autocomplete, refactoring confidence, and compile-time feedback improve productivity.
- **You're building internal services or microservices** - gRPC shines for service-to-service communication where performance and contracts matter more than browser compatibility.

RPC works best when you want your backend to feel like a shared library, not a distant HTTP interface.

## **Conclusion**

RPC isn't new - but it feels new again because modern tooling finally delivers on its original promise.

REST gave us a universal language for the web, and it's not going anywhere. It remains an excellent choice for resource-based APIs, public interfaces, and loosely coupled systems.

RPC flips the mental model. Instead of thinking in endpoints and resources, you think in functions and contracts. Modern frameworks like gRPC, tRPC, and oRPC bring type safety, performance, and developer experience to the forefront - making remote calls feel almost indistinguishable from local ones.

The real takeaway isn't "RPC is better than REST." It's this: **choose the model that matches how your system actually behaves.**

- If your API feels like a set of actions - use RPC.
- If it feels like a set of resources - REST is a great fit.

And if you're lucky enough to use both, you'll get the best of both worlds 🙂.

All the examples above have been included in a GitHub repo <a href="https://github.com/Suv4o/basic-examples-of-rpc" target="_blank" rel="noopener noreferrer">here</a>.
