---
title: Decoupling a System with Nest.js Microservices
description: Turn your Nest.js app into a distributed microservice system. Discover how message queues and shared libraries help create a loosely coupled backend. Each service handles its own responsibility, from order creation to persistence and notifications, without waiting on others. This approach makes your backend more resilient, fault-tolerant, and ready for real-world workloads.
image: https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_1200,e_sharpen:100/v1760140132/blog/decoupling-a-system-with-nestjs-microservices/decoupling-a-system-with-nestjs-microservices_hvyd6p
keywords:
    - Nest.js microservices
    - Nest.js monorepo
    - decoupled architecture
    - AWS SQS Nest.js
    - Amazon SES Nest.js
    - DynamoDB Nest.js
    - message queues
    - microservice communication
    - event-driven architecture
    - order processing system
    - LocalStack
    - Node.js backend
    - SQS message patterns
    - Nest.js project structure
    - scalable backend design
type: page
blog: post
published: 11th October 2025
readTime: 5
author: Aleksandar Trpkovski
articleTags:
    - Nest.js
    - Node.js
    - AWS
---

# Decoupling a System with Nest.js Microservices

_{{$document.published}} • {{$document.readTime}} min read — by **[{{$document.author}}](/)**_

::tag-pills{:tags="articleTags"}
::

![Landing Image](https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_850,e_sharpen:100/v1760140132/blog/decoupling-a-system-with-nestjs-microservices/decoupling-a-system-with-nestjs-microservices_hvyd6p)

Over the past few weeks, I've been experimenting with building a small microservice architecture using Nest.js, Amazon SQS, Amazon SES and DynamoDB. My goal was to create a decoupled system where three services work together through queues, one accepts orders, another saves them, and a third notifies the customer.

In this article, I'll walk you through an overview of the project, how the services are structured, and why this setup makes sense. This is not a step-by-step tutorial, but rather a tour of the system. If you want to dive into the details, you can check out the full source code on <a href="https://github.com/Suv4o/order-microservices" target="_blank" rel="noopener noreferrer">GitHub</a>

## The Monorepo Setup

I started with a Nest.js monorepo, which keeps everything in one place but neatly separated:

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

- **Apps** → Each folder is a microservice.
- **Libs** → Shared libraries so we don't repeat ourselves (AWS clients, DTOs, utilities).

If you want to learn how to set up a Nest.js monorepo, check out my other post: [How to Structure a Nest.js Project for Microservices (Monorepo Setup)](/2025/10/12/how-to-structure-a-nestjs-project-for-microservices-monorepo-setup).

## Meet the Services

Think of each service as a specialised team member in a small company. Each one has a single responsibility and communicates with others by passing messages.

### 1. **order-producer** – The Front Door

- A simple HTTP API (`POST /orders`).
- It accepts an order and immediately publishes messages to SQS.
- Returns quickly to the client while the heavy lifting happens in the background.

Example request:

```
POST http://localhost:3000/orders
Content-Type: application/json

{
  "orderId": "demo-1759035874968",
  "customerId": "customer-42",
  "totalAmount": 129.99,
  "currency": "USD",
  "items": [
    { "sku": "sku-123", "title": "Wireless Headphones", "quantity": 1, "unitPrice": 129.99 }
  ],
  "notes": "REST Client sample order",
  "metadata": { "channel": "rest-client", "requestedAt": "1759035874964" }
}
```

Behind the scenes, this produces two messages: one for persistence and one for notification.

### **3. order-persistence** – The Record Keeper

- No HTTP endpoints.
- Listens to its own SQS queue.
- Saves each incoming order message to DynamoDB.
- Uses SQS retry mechanism to ensure reliability even when failures occur.

### 3. **order-notification** – The Messenger

- No HTTP endpoints.
- Listens to another SQS queue.
- When an order arrives, it sends an email via SES.

## Shared Libraries – The Toolbox

Instead of duplicating code, I extracted common logic into shared libraries:

- **aws-clients** → Configures SQS, DynamoDB, SES clients (with LocalStack support for dev).
- **common-dto** → Defines TypeScript DTOs for orders so all services speak the same language.
- **common-utils** → Centralses small configuration helpers—like safe numeric environment parsing—and provides getSqsPollingSettings to standardize SQS polling configurations (batch size, wait time, visibility timeout, error backoff) across services.
- **sqs-microservice** → The "special sauce." A custom Nest.js microservice transport for SQS that lets services register handlers with `@MessagePattern` .

This keeps each microservice focused only on its business logic, not AWS plumbing.

## Why This Works

This structure gives us a few key benefits:

- **Single responsibility per service** → Easier to understand and scale independently.
- **Loose coupling with SQS** → Producers don't wait for consumers, and failures don't block the system.
- **Consistency with shared libraries** → All AWS clients and DTOs are in one place.
- **Clean monorepo** → Everything lives together but remains clearly separated.

## Local Development

I wired everything to run locally using **LocalStack** (for SQS + DynamoDB) and a **local SES inbox**. That means you can:

- Watch emails arrive in a browser (`http://localhost:8005`).
- Explore DynamoDB items in a web UI (`http://localhost:8001`).
- Send test orders with curl or VS Code's REST client.

In other words, it feels like production, but costs nothing.

## What's Next?

This project is intentionally simple, just enough to show the building blocks of microservices with Nest.js and AWS. You can extend it in several ways:

- Add authentication to the producer.
- Create more notification channels.
- Scale workers by running multiple instances.

## Final Notes

This post was an overview, not a comprehensive tutorial. If you'd like to explore the details, like the custom `SqsServer` class, `@MessagePattern` handlers, and local setup scripts, you can check out the full code on GitHub:

👉 <a href="https://github.com/Suv4o/order-microservices" target="_blank" rel="noopener noreferrer">GitHub Repository Link</a>
