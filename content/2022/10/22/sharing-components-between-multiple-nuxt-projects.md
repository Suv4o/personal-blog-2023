---
title: Sharing components between multiple Nuxt projects
description: Nuxt 3 and its new foundation come with many powerful new features, such as the new server engine Nitro that made the framework lighter and faster and supported by Vue's 3 Composition API and Vite. But one of Nuxt's features that not many people talk about is the ability to merge two or more applications and share functionalities between them. The extends feature in Nuxt 3 allows us to set a relative config path or remote git repositories such as GitHub, GitLab, Bitbucket or https:// pointing to the source directories of a project. This feature is a perfect use case for complex projects such us developing applications with a few different pieces, for example, an Admin and a User area that are designed separately but share the same components.
image: https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_1200,e_sharpen:100/v1666399302/blog/nuxt-extends/nuxt-extends
keywords:
    - Sharing components between multiple Nuxt projects
    - Nuxt.js
    - Vue.js
    - Components
    - Reusing components
    - Development
    - Web Development
type: page
blog: post
published: 22nd Oct 2022
readTime: 5
author: Aleksandar Trpkovski
articleTags:
    - Nuxt.js
    - Vue.js
    - TypeScript
---

# Sharing components between multiple Nuxt projects

_{{$document.published}} • {{$document.readTime}} min read — by **[{{$document.author}}](/)**_

::tag-pills{:tags="articleTags"}
::

::audio-player{:audioSrc="https://cdn.jsdelivr.net/gh/Suv4o/personal-blog-2023/audio-summary/2022/10/22/sharing-components-between-multiple-nuxt-projects/summary.mp3" :transcriptSrc="https://cdn.jsdelivr.net/gh/Suv4o/personal-blog-2023/audio-summary/2022/10/22/sharing-components-between-multiple-nuxt-projects/summary.json"}
::

![Landing Image](https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_750,e_sharpen:100/v1666399302/blog/nuxt-extends/nuxt-extends)

Nuxt 3 and its new foundation come with many powerful new features, such as the new server engine <a href="https://v3.nuxtjs.org/guide/concepts/server-engine/" target="_blank" rel="noopener noreferrer">Nitro</a> that made the framework lighter and faster and supported by Vue's 3 Composition API and Vite.

But one of Nuxt's features that not many people talk about is the ability to merge two or more applications and share functionalities between them. The <a href="https://v3.nuxtjs.org/api/configuration/nuxt-config/#extends" target="_blank" rel="noopener noreferrer">extends</a> feature in Nuxt 3 allows us to set a relative config path or remote git repositories such as GitHub, GitLab, Bitbucket or https:// pointing to the source directories of a project.

This feature is a perfect use case for complex projects such us developing applications with a few different pieces, for example, an Admin and a User area that are designed separately but share the same components.

Let's see how this works with an example.

## Setting up a base Nuxt 3 project

Create a new Nuxt project:

```bash
npx nuxi init nuxt-base
```

Navigate to the `nuxt-base` directory and install the dependencies:

```bash
cd nuxt-base
npm install
```

We will come back to this project a bit later. Next, let's create the other Nuxt project `nuxt-components`.

## Setting up a second Nuxt 3 project

Let's repeat what we've done previously with the new project.

```bash
npx nuxi init nuxt-components
cd nuxt-components
npm install
```

We should create both projects in the same folder:

```plain
/root
	/nuxt-base
		app.vue
		nuxt.config.ts
		package.json
		...
	/nuxt-components
		app.vue
		nuxt.config.ts
		package.json
		...
```

We will create a directory called components in the root of the `nuxt-components` project. Inside we will add two `.vue` files:

`random-message.vue` containing the following code:

```js
<template>
    <div>
        <h1>{{ msg }}</h1>
        <button @click="changeMsg">Generate a Message</button>
    </div>
</template>

<script setup>
import { ref } from "vue";
const msg = ref("");
const changeMsg = () => {
    msg.value = makeid(getRandomInt(100));
};

function makeid(length) {
    var result = "";
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
</script>
```

And `random-word.vue` containing the following code:

```js
<template>
    <div>
        <h1>{{ word }}</h1>
        <button @click="generateRandomWord">Generate a Word</button>
    </div>
</template>

<script setup>
import { ref } from "vue";
import randomWords from "random-words";

const word = ref("");

function generateRandomWord() {
    word.value = randomWords();
}
</script>
```

We also need to install the `random-word` npm package so let's do it:

```bash
npm install random-words
```

The idea with these two components we just created above is to use them in our `nuxt-base` project.

Before we move to the `next-base` project again, let's add configuration in the `nuxt.config.ts` file:

```ts
export default defineNuxtConfig({
    components: [{ path: "./components", prefix: "UI" }],
});
```

We added a prefix `UI` to all components in the `/components` directory. We can use these two components like this:

```ts
<UIRandomMessage />
<UIRandomWord />
```

## Adding `random-message.vue` and `random-word.vue` to the `nuxt-base` project

In the `app.vue` file inside the `nuxt-base` project, we will use `random-message.vue` and `random-word.vue` components.

Our `app.vue` file should look like the following:

```js
<template>
    <div>
        <UIRandomMessage />
        <UIRandomWord />
    </div>
</template>
```

Next, we need to tell Nuxt that we want to extend our `nuxt-base` project with `nuxt-components`. We can do so by adding the following in the `nuxt.config.ts` file:

```ts
export default defineNuxtConfig({
    components: true,
    extends: ["../nuxt-components"],
});
```

And that's it. We can run our application and see two components in action:

```bash
npm run dev
```

![blog hero image](https://res.cloudinary.com/suv4o/image/upload/v1666403383/blog/nuxt-extends/nuxt-extends-640gif_ryloin)

## Generate static site

Our application works as expected, running locally on our dev server. However, there is one problem if we try to generate statically. If we run `npm run generate`, we will get the following error:

```bash
ERROR  [vite]: Rollup failed to resolve import "vue/server-renderer" from "../nuxt-components/components/random-message.vue".
This is most likely unintended because it can break your application at runtime.
If you do want to externalize this module explicitly add it to
`build.rollupOptions.external`
```

To fix this issue, we need to create a `vite.config.ts` file in the root of our `nuxt-base` project and add the following code:

```bash
import { defineConfig } from "vite";

export default defineConfig({
    build: {
        rollupOptions: {
            external: ["vue/server-renderer"],
        },
    },
});
```

That's it. Now we can generate our `nuxt-base` app without any problems.

All examples above can be found in the following Github repositories: <a href="https://github.com/Suv4o/nuxt-extends-example" target="_blank" rel="noopener noreferrer">`nuxt-base`</a>, <a href="https://github.com/Suv4o/nuxt-component-generate-message" target="_blank" rel="noopener noreferrer">`nuxt-components`</a>.

## Conclusion

1. One of Nuxt's features that not many people talk about is the ability to merge two or more applications and share functionalities between them. A perfect use case will be designing an Admin and a User area that are developed separately but share the same components.
2. We can merge multiple projects by using the <a href="https://v3.nuxtjs.org/api/configuration/nuxt-config/#extends" target="_blank" rel="noopener noreferrer">extends</a> feature in Nuxt 3.
3. The extends feature allows us to set a relative config path or remote git repositories such as GitHub, GitLab, Bitbucket or https:// pointing to the source directories of a project.
4. To use another project inside our Nuxt app, we need to include the project's path in the `nuxt.config.ts` file.
5. To generate our project statically, we need to add `"vue/server-renderer"` to our `vite.config.ts` file.
