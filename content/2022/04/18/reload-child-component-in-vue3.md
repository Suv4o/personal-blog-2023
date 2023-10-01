---
title: Reload Child component in Vue 3
description: Components in Vue are reusable custom elements that can be reused in Vue templates throughout the app. In a large scale application, we will come across a situation where we have nested components such as parents and children. In recent work, I faced the challenge of having to reload the child component only. This article will explain the intricacies to the challenge. Looking back, it took me unbelievably long to figure out a solution. Nevertheless, my blog post will provide quick and easy, short, sharp steps to any developer who might be faced with the same challenge. Let’s get started. We can easily scaffold our Vue 3 project using Vite with the following command
image: https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_750,e_sharpen:100/v1650277793/blog/reload-child-component-in-vue-3/reload-child-component-in-vue-3-1_ccze7d
type: article
published: 18th Apr 2022
readTime: 4
author: Aleksandar Trpkovski
articleTags:
    - FrontEnd
    - Vue.js
    - JavaScript
---

# Reload Child component in Vue 3

_{{$document.published}} • {{$document.readTime}} min read — by **[{{$document.author}}](/)**_

::tag-pills{:tags="articleTags"}
::

![blog hero image](https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_750,e_sharpen:100/v1650277793/blog/reload-child-component-in-vue-3/reload-child-component-in-vue-3-1_ccze7d)

Components in Vue are reusable custom elements (for example `<card>` ) that can be reused in Vue templates throughout the app. In a large scale application, we will come across a situation where we have nested components such as parents and children.

In recent work, I faced the challenge of having to reload the child component only. This article will explain the intricacies to the challenge. Looking back, it took me unbelievably long to figure out a solution. Nevertheless, my blog post will provide quick and easy, short, sharp steps to any developer who might be faced with the same challenge. Let’s get started.

## Create a Vue 3 app using Vite

We can easily scaffold our Vue 3 project using Vite with the following command:

```bash
npm init vite@latest my-vue-app
```

Next, we follow the prompts, and choose Vue with JavaScript. Lastly, we install the dependency and run the project locally:

```bash
cd my-vue-app

npm install
npm run dev
```

## Make a component that displays a random number

Use the new **[Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)** syntax with `<script setup>` . The `<script setup>` feature was released in Vue 3.2.

First, create a new component called **_RandomNumber.vue_** in **_src/components/RandomNumber.vue_** directory. Next, create a reactive variable and assign a random number when the component mounts. Let's look at the following code in the **_RandomNumber.vue_** component:

```js
<script setup>
import { ref, onMounted } from "vue";

const randomNumber = ref(0);

onMounted(() => {
    randomNumber.value = Math.floor(Math.random() * 100);
});
</script>

<template>{{ randomNumber }}</template>
```

## Use **_`<RandomNumber>` component in our App.vue_**

In the **_App.vue_** file, we will import our **_RandomNumber.vue_** component and then use it in our template.

```js
<script setup>
import RandomNumber from "./components/RandomNumber.vue";
</script>

<template>
    <RandomNumber />
</template>
```

## Reload our **_`<RandomNumber>` component_**

Now, whenever we import our component we have a random number displayed. When we reload our webpage, a different number is shown. But how can we reload only the `<RandomNumber>` component?

That can be made possible by binding the `key` value to the component. Each time we assign a different key value, the component reloads. Let's see how we can achieve that:

```js
<script setup>
import { ref } from "vue";
import RandomNumber from "./components/RandomNumber.vue";

const keyIndex = ref(0);

function changeKey() {
    keyIndex.value++;
}
</script>

<template>
    <RandomNumber :key="keyIndex" />
    <button @click="changeKey">Re-Render</button>
</template>
```

In the code above, we’ve create a button whereby upon each click of the button, the function `changeKey` is activated. The `changeKey` increases the number of the reactive variable, `keyIndex`, upon each click. We bind the `key` of the `RandomNumber` with the `keyIndex` variable.

Now, with each click of the button, only the `<RandomNumber>` component reloads. Hence, a different number is displayed.

![blog hero image](https://res.cloudinary.com/suv4o/image/upload/c_scale,f_auto,w_750/v1650277793/blog/reload-child-component-in-vue-3/reload-child-component-in-vue-3-2_gnt1zf)

All examples above can be found in the following Github repository [link](https://github.com/Suv4o/reload-child-component-in-vue3).

## Conclusion

1. In a large scale application we will come across a situation where we have nested components such as parents and children.
2. To be able to reload only the child component, and not the entire website, we need to assign a `key` to the component.
3. Each time we assign different key to the component, the component automatically reloads.

---
