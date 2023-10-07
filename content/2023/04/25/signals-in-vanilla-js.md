---
title: Signals in Vanilla JS
description: If you're a JavaScript developer, you may have heard about the buzz around signals lately. Several popular JavaScript frameworks, such as Vue, Preact, Solid, Angular, and Quick, have recently implemented and supported the use of signals. But what exactly are signals? As web applications become more complex, managing the state of JavaScript applications becomes a challenge. This is where signals can be a valuable tool, allowing the application to respond to changes in the state, such as a variable change. In this article, we will explore the concept of signals and how they can be used in Vanilla JavaScript applications. We will use the Vue and Preact reactivity libraries and see how easy and similar these two approaches are to implement. For the demo project, we will use Vite. So let's get started by creating a Vite app.
image: https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_750,e_sharpen:100/v1682415127/blog/signals-in-vanilla-js/signals-in-vanilla-js-hero_lsdah8
type: article
published: 25th April 2023
readTime: 1
author: Aleksandar Trpkovski
articleTags:
    - JavaScript
    - TypeScript
    - Vite
---

# Signals in Vanilla JS

_{{$document.published}} • {{$document.readTime}} min read — by **[{{$document.author}}](/)**_

::tag-pills{:tags="articleTags"}
::

![Landing Image](https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_750,e_sharpen:100/v1682415127/blog/signals-in-vanilla-js/signals-in-vanilla-js-hero_lsdah8)

If you're a JavaScript developer, you may have heard about the buzz around signals lately. Several popular JavaScript frameworks, such as [Vue](https://vuejs.org/guide/extras/reactivity-in-depth.html#connection-to-signals), [Preact](https://preactjs.com/guide/v10/signals/), [Solid](https://www.solidjs.com/docs/latest/api#createsignal), [Angular](https://github.com/angular/angular/discussions/49090), and [Quick](https://qwik.builder.io/docs/components/state/#usesignal), have recently implemented and supported the use of signals. But what exactly are signals?

As web applications become more complex, managing the state of JavaScript applications becomes a challenge. This is where signals can be a valuable tool, allowing the application to respond to changes in the state, such as a variable change.

In this article, we will explore the concept of signals and how they can be used in Vanilla JavaScript applications. We will use the Vue and Preact reactivity libraries and see how easy and similar these two approaches are to implement. For the demo project, we will use Vite. So let's get started by creating a Vite app.

## Create a Vite app

To create a brand new Vite app, run the following command in your terminal:

```bash
yarn create vite
```

Name the project "signals-in-vanilla-js"

```bash
? Project name: › signals-in-vanilla-js
```

Select Vanilla with TypeScript.

```bash
? Select a framework: › - Use arrow-keys. Return to submit.
❯   Vanilla
    Vue
    React
    Preact
    Lit
    Svelte
    Others
```

```bash
? Select a variant: › - Use arrow-keys. Return to submit.
❯   TypeScript
    JavaScript
```

After creating the new project, navigate to the root directory of the project and install the dependencies using the following commands in the terminal:

```bash
cd signals-in-vanilla-js
yarn
```

By default, Vite runs on port `5173`. This is not a big deal, but you can easily change it to run on port `3000` with `https` by installing the following package:

```bash
yarn add @vitejs/plugin-basic-ssl
```

To begin, create a file called `vite.config.ts` in the root of your project and add the following code:

```bash
import { defineConfig } from "vite";
import basicSsl from "@vitejs/plugin-basic-ssl";

export default defineConfig({
    server: {
        port: 3000,
        https: true,
    },
    plugins: [basicSsl()],
});
```

Now, we can run our project in the browser.

```bash
yarn dev
```

## Using Signals with Preact

To use Signals, we need to install the Preact package. Run the following command in the terminal:

```bash
yarn add @preact/signals-core
```

Next, we need to add the following code to the `main.ts` file:

```ts
import "./style.css";
import { signal, computed, effect } from "@preact/signals-core";
const counter = signal(1);
const result = computed(() => counter.value * 10);

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <h1>Signals in Vanilla JS</h1>
    <div class="card">
      <button type="button">count is <span class="counter">${counter.value}</span></button>
    </div>
    <p>Result: <span class="counter">${counter.value}</span> * 10 = <span class="result">10</span></p>
  </div>
`;

function setCounter() {
    const counterElements = document.querySelectorAll<HTMLSpanElement>(".counter");
    const resultElement = document.querySelector<HTMLSpanElement>(".result");

    if (!counterElements?.length || !resultElement) {
        return;
    }

    counterElements.forEach((element) => {
        element.innerText = counter.value.toString();
    });

    resultElement.innerText = result.value.toString();
}

const button = document.querySelector<HTMLButtonElement>("button");

button?.addEventListener("click", () => {
    counter.value++;
});

effect(setCounter);
```

Let's explain what the code above does. First, we import `signal`, `computed`, and `effect` from `@preact/signals-core`, which we have installed.

We can easily define reactive variables using `signal`.

```ts
const counter = signal(1);
```

To update the counter signal, simply access the `.value` property and update it with the desired value. In this case, the button click event increases the counter signal by one.

```ts
button?.addEventListener("click", () => {
    counter.value++;
});
```

The Preact library provides a `computed` function that allows us to compute a reactive value based on a signal. In our case, we multiply the counter by 10 in the computed value called `result`. The `result` returns the newly calculated value whenever the counter signal changes.

```ts
const result = computed(() => counter.value * 10);
```

Finally, we use the `effect` function to watch for any signal changes inside a function passed as a parameter. `effect` will execute the function anytime there is a signal change. In this way, we can re-render the counter and result to the HTML any time we update the counter signal.

## Using Signals with Vue

Just as we implemented signals using the Preact library, we can do the same with Vue. Let's install Vue by running the following command in the terminal:

```bash
yarn add vue
```

Next, replace the following code inside the `main.ts` file.

```ts
import "./style.css";
import { ref, computed, watch } from "vue";
const counter = ref(1);
const result = computed(() => counter.value * 10);

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <h1>Signals in Vanilla JS</h1>
    <div class="card">
      <button type="button">count is <span class="counter">${counter.value}</span></button>
    </div>
    <p>Result: <span class="counter">${counter.value}</span> * 10 = <span class="result">10</span></p>
  </div>
`;

function setCounter() {
    const counterElements = document.querySelectorAll<HTMLSpanElement>(".counter");
    const resultElement = document.querySelector<HTMLSpanElement>(".result");

    if (!counterElements?.length || !resultElement) {
        return;
    }

    counterElements.forEach((element) => {
        element.innerText = counter.value.toString();
    });

    resultElement.innerText = result.value.toString();
}

const button = document.querySelector<HTMLButtonElement>("button");

button?.addEventListener("click", () => {
    counter.value++;
});

watch(counter, () => {
    setCounter();
});
```

As we can see from the code above, this code is very similar to the code we implemented with Preact signals. The only difference here is that we import `ref`, `computed`, and `watch` from `vue`.

Here are the differences: in Vue, we use `ref` instead of `signal` to define a reactive variable. To update a `ref` variable, simply access its `.value` property, just as we did in Preact. The `computed` function behaves the same way, and the `watch` helps us watch a `ref` variable change simply by passing the variable as a parameter. In the callback function, we add logic that will be executed once the variable has changed.

![demo in animated video gif](https://res.cloudinary.com/suv4o/image/upload/w_750/v1682415127/blog/signals-in-vanilla-js/signals-in-vanilla-js_uecikt)

I hope you find this article helpful. You can find code examples in the following GitHub repository [here](https://github.com/Suv4o/signals-in-vanilla-js).
