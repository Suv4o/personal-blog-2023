---
title: How to Structure a Nest.js Project for Microservices (Monorepo Setup)
description: A clean and scalable way to structure your Nest.js project for microservices. This step-by-step guide helps you organise multiple apps and shared libraries for a scalable architecture. Perfect for developers who want a maintainable, modular, and production-ready backend foundation with Nest.js.
image: https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_1200,e_sharpen:100/v1760240493/blog/how-to-structure-a-nestjs-project-for-microservices-monorepo-setup/how-to-structure-a-nestjs-project-for-microservices-monorepo-setup_hfc2gz
keywords:
    - Nest.js microservices
    - Nest.js monorepo setup
    - Nest.js project structure
    - Nest.js tutorial
    - Nest.js AWS SQS
    - Nest.js DynamoDB
    - Nest.js Amazon SES
    - Nest.js shared libraries
    - Nest.js microservice architecture
    - Nest.js CLI
    - Node.js microservices
    - Monorepo architecture Nest.js
    - Nest.js apps and libs structure
    - How to create microservices with Nest.js
    - Nest.js best practices
type: page
blog: post
published: 12th October 2025
readTime: 4
author: Aleksandar Trpkovski
articleTags:
    - Nest.js
    - Node.js
    - BackEnd
---

# How to Structure a Nest.js Project for Microservices (Monorepo Setup)

_{{$document.published}} • {{$document.readTime}} min read — by **[{{$document.author}}](/)**_

::tag-pills{:tags="articleTags"}
::

::audio-player{:audioSrc="https://cdn.jsdelivr.net/gh/Suv4o/personal-blog-2023/audio-summary/2025/10/12/how-to-structure-a-nestjs-project-for-microservices-monorepo-setup/summary.mp3" :transcriptSrc="https://cdn.jsdelivr.net/gh/Suv4o/personal-blog-2023/audio-summary/2025/10/12/how-to-structure-a-nestjs-project-for-microservices-monorepo-setup/summary.json"}
::

![Landing Image](https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_850,e_sharpen:100/v1760240493/blog/how-to-structure-a-nestjs-project-for-microservices-monorepo-setup/how-to-structure-a-nestjs-project-for-microservices-monorepo-setup_hfc2gz)

In this post, we'll walk through setting up a simple microservices project using Nest.js. Our goal is to create three separate services: **order-producer**, **order-persistence**, and **order-notification**, that communicate via **Amazon SQS**, store data in **DynamoDB**, and send notifications to customers using **Amazon SES**.

This is just a setup guide, not a full tutorial on microservices. By the end, you’ll have a clean monorepo structure ready to extend. If you’d like to see the full working example, you can check out the GitHub repository.

## Step 1: Create a New Nest.js Project

We'll use `npx` with the Nest.js CLI, but you can also install it globally as a dependency and use the `nest` command instead of `npx`. For more details, check the official documentation <a href="https://docs.nestjs.com/cli/overview" target="_blank" rel="noopener noreferrer">here</a>.

First, scaffold a new Nest.js project

```bash
npx @nestjs/cli new order-microservices
cd order-microservices
```

This will generate the base standard Nest.js project. While this is a starting point, we'd like to convert our project to a monorepo where each app will act as a separate microservice.

## Step 2: Generate the Microservices (Monorepo Apps)

Inside the Nest.js project we just created, let's create three separate apps:

```bash
npx @nestjs/cli generate app order-producer
npx @nestjs/cli generate app order-persistence
npx @nestjs/cli generate app order-notification
```

Now your project structure looks like this:

```
order-microservices/
  apps/
    order-microservices/   👈 created by default
    order-producer/
    order-persistence/
    order-notification/
  libs/
  nest-cli.json
```

> Note: The default **order-microservices** app has been moved inside `apps/` along with the other apps we just created. We don't need it anymore since we've converted this to a monorepo.

Let's remove **order-microservices** and keep only **order-producer**, **order-persistence**, and **order-notification**.

```bash
sudo rm -rf apps/order-microservices
```

## Step 3: Create Shared Libraries

Microservices often need to share code such as: DTOs, utilities, AWS client configuration, and more. The Nest.js CLI makes this easy to set up and manage.

We'll use the library command from the Nest.js CLI to generate some shared libraries:

```bash
npx @nestjs/cli generate library common-dto
npx @nestjs/cli generate library aws-clients
npx @nestjs/cli generate library common-utils
npx @nestjs/cli generate library sqs-microservice
```

Now your structure is much cleaner:

```
order-microservices/
  apps/
    order-producer/
    order-persistence/
    order-notification/
  libs/
    aws-clients/
    common-dto/
    common-utils/
    sqs-microservice/
  nest-cli.json
```

## Step 4: Update the Monorepo Config (`nest-cli.json`)

Since we deleted the default app, we need to update `nest-cli.json`.

Remove the extra entries and keep only the structure pointing to our three apps. Delete the following lines:

```json
"sourceRoot": "apps/order-microservices/src",
"tsConfigPath": "apps/order-microservices/tsconfig.app.json",
"order-microservices": { ... }
```

And make sure the root looks like this:

```json
"root": "apps"
```

This ensures Nest knows where to find your apps.

## Step 5: Configure Each Service’s Entry Point

Each service needs its own startup logic.

### Producer (HTTP API service)

`apps/order-producer/src/main.ts`

```ts
await app.listen(3001);
```

This service exposes an HTTP endpoint and needs a port.

### Persistence & Notification (background workers)

Since these services only listen for messages from SQS, they don't need an HTTP port. Replace `app.listen()` with `app.init()` and convert them into microservices following the official Nest.js Microservices documentation <a href="https://docs.nestjs.com/microservices/basics" target="_blank" rel="noopener noreferrer">here</a>.

`apps/order-persistence/src/main.ts`

```ts
import { NestFactory } from "@nestjs/core";
import { Transport, MicroserviceOptions } from "@nestjs/microservices";
import { AppModule } from "./app.module";

async function bootstrap() {
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
        transport: Transport.SQS, // later replaced with custom SQS server
    });
    await app.init();
}
void bootstrap();
```

`apps/order-notification/src/main.ts`

```ts
import { NestFactory } from "@nestjs/core";
import { Transport, MicroserviceOptions } from "@nestjs/microservices";
import { AppModule } from "./app.module";

async function bootstrap() {
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
        transport: Transport.SQS,
    });
    await app.init();
}
void bootstrap();
```

---

## Step 6: Add Scripts to `package.json`

Finally, let’s make it easy to build and run each service separately by updating `package.json`:

```json
"build": "npm run build:producer && npm run build:persistence && npm run build:notification",
"build:producer": "nest build order-producer",
"build:persistence": "nest build order-persistence",
"build:notification": "nest build order-notification",

"start:producer": "nest start order-producer",
"start:producer:dev": "nest start order-producer --watch",
"start:producer:prod": "node dist/apps/order-producer/main",

"start:persistence": "nest start order-persistence",
"start:persistence:dev": "nest start order-persistence --watch",
"start:persistence:prod": "node dist/apps/order-persistence/main",

"start:notification": "nest start order-notification",
"start:notification:dev": "nest start order-notification --watch",
"start:notification:prod": "node dist/apps/order-notification/main"
```

Now you can run each service independently, either in dev (`--watch`) or in prod mode.

## Recap

At this point, you’ve:

1. Created a Nest.js monorepo.
2. Generated three microservices (`producer`, `persistence`, `notification`).
3. Cleaned up the default app.
4. Added shared libraries (`dto`, `utils`, `aws-clients`, `sqs-microservice`).
5. Updated `nest-cli.json` to reflect the monorepo setup.
6. Configured startup logic for each service.
7. Added scripts to build and run services individually.

👉 If you want to see the **next steps** (including how the services actually talk to each other), check out the main blog post: <NuxtLink to="/2025/10/11/decoupling-a-system-with-nestjs-microservices">Decoupling a System with Nest.js Microservices</NuxtLink>.
