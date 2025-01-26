---
title: Suspense feature in Vue 3 with SFC Script Setup
description: <Suspense> is a special component in Vue 3 that lets us wait for some data to be loaded, before our component can be rendered. In other words, Suspense allows us to render some fallback content. A good example will be a loading spinner while waiting for an asynchronous API call to fetch some data from the server. Once the data has been loaded, the main content will show up. This feature allows us to create a smooth user experience. The <script setup> has top-level await, this means that the reactive variable msg won't be shown in the template until the fetch is completed. To improve the user experience, it would be nice if we displayed a loading message before the data has been loaded. This is where Suspense comes handy.
image: https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_1200,e_sharpen:100/v1632533795/blog/vue3-suspense/vue3-suspence-cover
keywords:
    - Suspense feature in Vue 3 with SFC Script Setup
    - Vue.js
    - Suspense
    - JavaScript
    - Loading
    - Show Spinner
    - Development
    - Web Development
type: page
blog: post
published: 25th Sep 2021
readTime: 6
author: Aleksandar Trpkovski
articleTags:
    - JavaScript
    - Vue.js
    - FrontEnd
---

# Suspense feature in Vue 3 with SFC Script Setup

_{{$document.published}} • {{$document.readTime}} min read — by **[{{$document.author}}](/)**_

::tag-pills{:tags="articleTags"}
::

![blog hero image](https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_750,e_sharpen:100/v1632533795/blog/vue3-suspense/vue3-suspence-cover)

`<Suspense>` is a special component in Vue 3 that lets us wait for some data to be loaded, before our component can be rendered. In other words, Suspense allows us to render some fallback content. A good example will be a loading spinner while waiting for an asynchronous API call to fetch some data from the server. Once the data has been loaded, the main content will show up. This feature allows us to create a smooth user experience.

Let me demonstrate an example of how to use `<Suspense>` in Vue 3.

> Note: Suspense is still an experimental new feature and the API could change down the track.

## Create a Vue 3 app using Vite

We can easily scaffolding our Vue 3 project using Vite with the following command:

```bash
npm init vite@latest my-vue-app
```

Next, we follow the prompts and choose Vue with JavaScript. Lastly, we install the dependency and run the project locally:

```bash
cd my-vue-app

npm install
npm run dev
```

## Make an asynchronous API call

We are going to use the new `<script setup>` syntax using [Composition API](https://v3.vuejs.org/api/composition-api.html). This feature was released with Vue 3.2.

First, create a new component called **_Result.vue_** in **_src/components/Result.vue_** directory. Next, use the [OpenLibrary](https://openlibrary.org/developers/api) API to fetch all **The Lord Of The Rings** books. Let's look at the following code in **_Result.vue_** component:

```js
<script setup>
	import { ref } from "vue";

	const response = await fetch("http://openlibrary.org/search.json?q=the+lord+of+the+rings");
	const data = await response.json();

	const msg = ref(`It has been found: ${data.num_found} results!`);
</script>

<template>
    <h1>{{ msg }}</h1>
</template>
```

The `<script setup>` has top-level await, this means that the reactive variable `msg` won't be shown in the template until the fetch is completed. To improve the user experience, it would be nice if we displayed a loading message before the data has been loaded. This is where Suspense comes handy.

## Use `<Suspense>` component

In the **_App.vue_** file, we will import our **_Result.vue_** component and then use it in our template. We next wrap our `<Result />` component with the special Vue `<Suspense>`component. Suspense is a built-in component in Vue 3. Hence, we do not need to import it.

The `<Suspense>` component has two slots, `default` and `fallback`. In our example below, while the content isn't ready, the `fallback` component is rendered. When the data has been successfully loaded, the `default` component is displayed. Sounds easy, doesn't it. Let's see our code in **_App.vue_** file:

```js
<script setup>
 import Result from "./components/Result.vue";
</script>

<template>
    <Suspense>
        <template #default>
            <Result />
        </template>
        <template #fallback>
            <h1>Loading...</h1>
        </template>
    </Suspense>
</template>
```

**Loading...** will be displayed while we wait for the fetch API to be completed. Once the data is loaded, `<Result />` component will be rendered. In our example, it will be displayed as **It has been found: 487 results!**.

But what will happen if we have an error while fetching the data from the API? Currently, the fallback component will stay for an infinite amount of time as there is no error handler. So how can we then deal with errors?

## Handling Errors

Dealing with errors in Vue is simple. Vue 3 provides `onErrorCaptured` lifecycle hook that can listen to errors. Let's see how that would look like in our final code:

```js
<script setup>
import { ref, onErrorCaptured } from "vue";
import Result from "./components/Result.vue";

const error = ref(null);

onErrorCaptured(() => {
    error.value = "Ohh! Something went wrong!";
});
</script>

<template>
    <div v-if="error">{{ error }}</div>
    <Suspense v-else>
        <template #default>
            <Result />
        </template>
        <template #fallback>
            <h1>Loading...</h1>
        </template>
    </Suspense>
</template>

<style>
```

In the above, we created `onErrorCaptured` hook and a reactive variable called `error`. Now when an error occurs, Vue hook will be able to capture it and assign value to the `error` reactive variable. In our template, we have a condition, if the error exists then we display the error message: **Ohh! Something went wrong!**, otherwise we continue with the Suspense component.

![blog hero image](https://res.cloudinary.com/suv4o/image/upload/c_scale,f_auto,w_750/v1632533777/blog/vue3-suspense/vue3-suspense_mpqxff)

## Conclusion

1. `<Suspense>` is a special component in Vue 3 that lets us wait for some data to be loaded, before our component can be rendered.
2. We can use the new `<script setup>` syntax and its top-level await feature to asynchronously load data from the server.
3. The `<Suspense>` component has two slots, `default` and `fallback`. When the content isn't ready, the `fallback` component is rendered. When data is successfully loaded, the `default` component is displayed.
4. Dealing with errors in Vue is simple. Vue 3 provides `onErrorCaptured` lifecycle hook that can listen to errors.

All examples above can be found in the following Github repository [link](https://github.com/Suv4o/suspense-feature-in-vue-3).
