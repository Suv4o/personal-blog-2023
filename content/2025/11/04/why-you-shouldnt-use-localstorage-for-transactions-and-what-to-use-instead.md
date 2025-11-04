---
title: Why You Shouldn’t Use localStorage for Transactions - and What to Use Instead
description: localStorage may be convenient, but it’s not built for handling complex operations, concurrent writes, or large volumes of data. What seems simple at first can quickly lead to frozen UIs and unreliable transactions. In this article, we dive into the hidden limitations of localStorage and explore how modern, asynchronous storage solutions like IndexedDB and localForage deliver the speed, safety, and scalability that today’s web apps need.
image: https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_1200,e_sharpen:100/v1762215611/blog/why-you-shouldnt-use-localstorage-for-transactions-and-what-to-use-instead/why-you-shouldnt-use-localstorage-for-transactions-and-what-to-use-instead_kqnbsb
keywords:
    - localStorage transactions
    - localStorage vs IndexedDB
    - localStorage performance issues
    - IndexedDB tutorial
    - localForage example
    - browser storage alternatives
    - JavaScript data storage
    - asynchronous browser storage
    - why not use localStorage
    - IndexedDB for beginners
    - IndexedDB vs localStorage performance
    - web app data storage best practices
    - localStorage blocking main thread
    - improve browser performance
    - safe data storage in web apps
    - JavaScript async storage APIs
    - non-blocking browser storage
    - frontend performance optimization
type: page
blog: post
published: 4th November 2025
readTime: 3
author: Aleksandar Trpkovski
articleTags:
    - JavaScript
    - FrontEnd
    - Vite
---

# Why You Shouldn’t Use localStorage for Transactions - and What to Use Instead

_{{$document.published}} • {{$document.readTime}} min read — by **[{{$document.author}}](/)**_

::tag-pills{:tags="articleTags"}
::

![Landing Image](https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_850,e_sharpen:100/v1762215611/blog/why-you-shouldnt-use-localstorage-for-transactions-and-what-to-use-instead/why-you-shouldnt-use-localstorage-for-transactions-and-what-to-use-instead_kqnbsb)

When it comes to storing data in the browser, many of us reach for `localStorage` out of habit. It's simple, it works, and it's supported everywhere. But here's the thing - under the hood, `localStorage` has some serious limitations, especially when you're dealing with _transactions_, _concurrent updates_, and _performance-heavy tasks_.

Let's explore what those limitations are - and what better alternatives exist for building reliable, performant browser storage.

## How `localStorage` Works

`localStorage` is a simple key-value storage system that's built into every modern browser. You've probably used it before - it looks something like this:

```js
localStorage.setItem("theme", "dark");
const theme = localStorage.getItem("theme");
```

Pretty straightforward, right? But here's the catch:

> 🕒 localStorage operations are synchronous.

That means every `setItem`, `getItem`, or `removeItem` call blocks the **main thread** until it's done. In small doses, no big deal. But when you start doing large or repeated operations, it can actually freeze your UI and create a poor experience.

## Example: Blocking the Main Thread

Want to see this in action? Try running this in your browser console:

```js
console.time("localStorage writes");

for (let i = 0; i < 100000; i++) {
    localStorage.setItem(`key-${i}`, `value-${i}`);
}

console.timeEnd("localStorage writes");
alert("Finished writing to localStorage!");
```

You'll notice your browser **freezes** for a few seconds before the alert pops up. That's because every `setItem` call blocks everything else - nothing can run until all those writes finish. Not a great user experience, right? 🙂

## A Better Way: `IndexedDB`

`IndexedDB` is a built-in browser database that's designed for **asynchronous**, **transactional**, and **large-scale** data storage. It might sound intimidating at first, but it's easier than you think!

Here's how you can do the same thing we just tried, but without freesing the UI:

```js
function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("TestDB", 1);
        request.onupgradeneeded = () => {
            request.result.createObjectStore("store");
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

async function saveToIndexedDB() {
    console.time("IndexedDB writes");
    const db = await openDB();

    const tx = db.transaction("store", "readwrite");
    const store = tx.objectStore("store");

    for (let i = 0; i < 10000; i++) {
        store.put(`value-${i}`, `key-${i}`);
    }

    tx.oncomplete = () => {
        console.timeEnd("IndexedDB writes");
        alert("Finished writing to IndexedDB!");
    };
}

saveToIndexedDB();
```

This version uses **asynchronous transactions**, which means the browser stays responsive while your data is being written.

## Even Easier: `localForage`

Now, if you're like me and love simplicity, you're going to _love_ <a href="https://github.com/localForage/localForage" target="_blank" rel="noopener noreferrer">localForage</a>. It's a lightweight wrapper around `IndexedDB` (with fallbacks to WebSQL or localStorage) that gives you a clean, **Promise-based API**:

```bash
npm install localforage
```

```js
import localforage from "localforage";

async function saveToLocalForage() {
    console.time("localForage writes");

    const promises = [];
    for (let i = 0; i < 10000; i++) {
        promises.push(localforage.setItem(`key-${i}`, `value-${i}`));
    }

    await Promise.all(promises);
    console.timeEnd("localForage writes");
    alert("Finished writing to localForage!");
}

saveToLocalForage();
```

This version uses **IndexedDB under the hood** but gives you the same simple API style as `localStorage` - without any of the blocking or complexity. Best of both worlds!

## Why `localStorage` Fails for Transactions

When we talk about **transactions**, we usually mean multiple operations that need to succeed or fail together. Unfortunately, `localStorage` just isn't built for that. Let me show you why:

| Problem                      | Description                                                           |
| ---------------------------- | --------------------------------------------------------------------- |
| 🧵**Synchronous & blocking** | Freezes the main thread during heavy writes.                          |
| ❌**No transaction support** | You can't rollback or commit multiple changes atomically.             |
| ⚔️**No concurrency control** | Two tabs or scripts can easily overwrite each other's data.           |
| 📦**Tiny storage limit**     | Typically 5–10 MB total.                                              |
| 🔓**No security**            | Data is stored in plain text, accessible to any script on the domain. |

> In short, `localStorage` is perfectly fine for _simple preferences_ or _light caching_

Unlike `localStorage`, which saves each item one by one, `IndexedDB` handles your data in a much safer way. It uses something called _transactions_, which simply means that all your data changes happen together as a single, reliable action.

If everything goes well, the changes are saved. But if something goes wrong halfway through - say, your browser crashes or one of the operations fails - **nothing gets written**. Your data stays clean, consistent, and exactly how it was before.

## Quick Summary

Here's a user-friendly table I put together to give you a clean and easy way to compare the pros and cons of the three options we discussed above:

| Feature       | `localStorage` | `IndexedDB`         | `localForage`          |
| ------------- | -------------- | ------------------- | ---------------------- |
| Blocking      | ✅ Yes         | ❌ No               | ❌ No                  |
| Transactions  | ❌ No          | ✅ Yes              | ✅ Yes (via IndexedDB) |
| Concurrency   | ❌ Unsafe      | ✅ Safe             | ✅ Safe                |
| Storage Limit | ~5–10 MB       | Hundreds of MBs+    | Same as IndexedDB      |
| Use Case      | Small settings | Complex, large data | Simple async API       |

You can find all the working code examples from this article in <a href="https://github.com/Suv4o/why-you-shouldnt-use-localstorage-for-transactions-and-what-to-use-instead?tab=readme-ov-file" target="_blank" rel="noopener noreferrer">my GitHub account</a>
