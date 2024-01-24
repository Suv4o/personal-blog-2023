---
title: How to Define Multiple Components in a Single File in Nuxt using JSX
description: In this blog article, we have demonstrated how to define multiple components in a single .vue file in Nuxt using JSX. By using JSX, we can combine regular Vue components and JSX components in the same file, thus utilising the same reactivity system provided by Vue. While it is generally recommended to separate components into individual files, there are situations where declaring small components in the same file can be beneficial. We hope you found this blog article useful. Please subscribe for more articles like this in the future.
image: https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_1200,e_sharpen:100/v1705811682/blog/how-to-defining-multiple-components-in-a-single-file-in-nuxt/dx3lzu2av0hwbu2hkuob
keywords:
    - Nuxt.js
    - Vue.js
    - TypeScript
    - JSX
    - TSX
    - Tailwind CSS
    - Multiple Components
    - Single File
    - Vue
    - Vue 3
    - Web Development
    - Development
type: article
published: 23rd January 2024
readTime: 10
author: Aleksandar Trpkovski
articleTags:
    - Nuxt.js
    - Vue.js
    - TypeScript
---

# How to Define Multiple Components in a Single File in Nuxt using JSX

_{{$document.published}} • {{$document.readTime}} min read — by **[{{$document.author}}](/)**_

::tag-pills{:tags="articleTags"}
::

![Landing Image](https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_750,e_sharpen:100/v1705811682/blog/how-to-defining-multiple-components-in-a-single-file-in-nuxt/dx3lzu2av0hwbu2hkuob)

I've been using Vue and Nuxt for quite a while now. One feature I've always been missing is the ability to declare more than one component in a single `.vue` file. This has been possible in other frameworks like React for a long time. I know that most people will say that if you want more than one component, it's a good idea to separate those components into separate files. I agree with that statement and it makes sense. However, sometimes for very small components that won't be used in other places in the code, it also makes sense to declare them in the same file to make the code more readable.

I thought that it wasn't possible until I found out that we can actually do that. In this article, I'm going to demonstrate how we can declare more than one component in Nuxt 3 and provide a few examples. So keep reading.

## Create a new Nuxt project.

First, we are going to create a brand new Nuxt 3 project. Execute the following command in your terminal and name your project `nuxt-multiple-components`, or choose any other name that you prefer:

```bash
npx nuxi@latest init nuxt-multiple-components
```

I chose `yarn` as my package manager, but you can choose between `npm`, `pnpm`, or `bun` if you prefer those instead.

Once the project has been initialised, we need to install the dependencies and start the project using the following commands in the terminal:

```bash
cd nuxt-multiple-components
yarn
yarn dev

```

Great! Now our project is set up. Before diving into the code, let's do some clean-up. In the `app.vue` file, please delete the predefined component so that the code will look like the following:

```ts
<script setup>
<script>

<template>
</template>

```

## Define our first component in `JSX`.

Some may wonder what JSX can do with Vue frameworks. Although JSX is a popular JavaScript syntax in `React.js` and frameworks that use React, such as `Next` and `Remix`, we can technically write `JSX` in Vue as well. This is what we will use to declare multiple components in a single file in Vue.

The very first thing we need to do is to define the language in the `<script setup>` to be `jsx` or, in our case here I prefer to use TypeScript and will be using `tsx` instead. So let's do that. In the `app.vue` file, set `lang` to `tsx` in order to enable writing JSX code in our `.vue` file:

```ts
<script setup lang="tsx">
<script>
```

Then let's define our first `<CustomLink/>` JSX component:

```ts
<script setup lang="tsx">
    const CustomLink = (props: { href: string; name: string }) => <a href="{props.href}>{props.name}"</a>;
<script>
```

We declare an anchor HTML element component that receives two props: `href` and `name`. To use this component in our tablet, we follow the same approach as using other Vue components. Here is how we use it:

```html
<template>
    <CustomLink href="https://vitejs.dev" name="Vite" />
</template>
```

We can even declare reactive `ref` variables as we usually do in the Vue composition API and pass those values as props without losing any reactivity:

```ts
<script setup lang="tsx">
	const href = "https://vitejs.dev";
	const name = "Vite";
    const CustomLink = (props: { href: string; name: string }) => <a href="{props.href}>{props.name}"</a>;
<script>
```

```html
<template>
    <CustomLink :href="href" :name="name" />
</template>
```

The advantage of this is that we can combine regular Vue components, JSX components, and regular HTML all together in the same Vue template within a `.vue` file. Therefore, the following example will still be valid syntax:

```html
<template>
    <p>This is my first JSX component!</p>
    <CustomLink :href="href" :name="name" />
    <p>Let me know what you think!</p>
</template>
```

## Create a `<Card />` component by utilising various components.

Now that we have demonstrated how to create a simple JSX component, let's proceed to create a more complex component using both Vue and JSX together.

Before we start building our Card component, let's add Tailwind CSS to our project. This will make it easier to style our components.

### Add Tailwind CSS.

Adding Tailwind to our Nuxt project is simple. First, we need to install the required dependencies and initialise Tailwind CSS using the following commands:

```bash
yarn add -D tailwindcss postcss autoprefixer
npx tailwindcss init
```

Next, we need to add the following to the `nuxt.config.ts` file:

```ts
css: ['~/assets/css/main.css'],
postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
```

Then, add the following code to the `tailwind.config.js` file:

```ts
content: ["**/*.vue"],
```

Finally, create a `main.css` file in the `assets/css` folder and add the following content:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Define the components.

We will build the following Card component:
![Card Component](https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_750,e_sharpen:100/v1705811677/blog/how-to-defining-multiple-components-in-a-single-file-in-nuxt/utw0ryorqxndtrcr0lbl)

However, before we start building the component, we will divide it into several smaller individual components.

-   `<CardImage />`: This will be a regular Vue component defined inside the `/components` directory. We are using a Vue component to demonstrate the ability to mix and match Vue and JSX components.
-   `<CardDescription />`: This will be a JSX component.
-   `<CardButton />`: This will also be a JSX component.
-   `<Card />`: This will be the master component, also built with JSX, that will include all of the components mentioned above.

Now that we have listed our components, let's start building them.

### Create the `<CardImage />` component.

First, we are going to create the `<CardImage />` component. As mentioned earlier, this will be a regular Vue component. Inside the `/components` folder in Nuxt, we are going to create the following `CardImage.vue` component:

```ts
<script setup lang="ts">
const props = defineProps<{
    src: string;
}>();
</script>

<template>
    <img class="mx-auto h-48 w-48 rounded-full md:h-56 md:w-56" :src="props.src" alt="card image" />
</template>
```

Here, we will only have one property, `src`, where we can add the image path.

### Create the `<CardDescription />` component.

Next, we will create a `<CardDescription />` JSX component. This component will be declared in the `app.vue` component located in the root directory. We will define the script setup with `lang="tsx"`, as we have shown earlier in the article. To avoid repetition, we will refrain from adding `lang="tsx"` to the JSX components that we will declare later in the article.

```ts
const CardDescription = (props: { name: string; title: string }) => (
    <>
        <h3 class="mt-6 text-base font-semibold leading-7 tracking-tight text-white">{props.name}</h3>
        <p class="text-sm leading-6 text-yellow-400">{props.title}</p>
    </>
);
```

This component will accept two props: `name` and `title`.

### Create the `<CardButton />` component.

The `<CardButton />` is another JSX component that will be created in the `app.vue` file. In this component, we will demonstrate how to use a function declared in the `<script setup>` section and utilise it inside the `onClick` event of this component. The function will simply toggle a boolean reactive `ref` variable between the `true` and `false` states. Later, we will make use of this reactive variable in our `<Card/>` component in the next section. So, let's first declare the function and the reactive variable `isCardRed`:

```ts
const isCardRed = ref(true);

function updateStyle() {
    isCardRed.value = !isCardRed.value;
}
```

Next, we will declare the `<CardButton />` component:

```ts
const CardButton = (props: { action: () => any }, components: { slots: any }) => (
    <div class="mt-6 flex justify-center gap-x-6">
        <button
            onClick={props.action}
            type="submit"
            class="flex-none rounded-md bg-yellow-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-yellow-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-500"
        >
            {components.slots.default()}
        </button>
    </div>
);
```

As we can see, we only have one prop here called `action`, which we will use to pass a function. We will pass the `updateStyle` function to this prop later when we use this component.

Another parameter apart from the props we are passing is the `components` parameter, which has a property of `slots`. We call this parameter inside the JSX as `components.slots.default()`. This allows us to pass slots in the same way as we do with Vue components, something like this:

```html
<CardButton :action="updateStyle">Switch Colour</CardButton>
```

Now, let's build our main `<Card />` component where we can use all the components we declared above together.

### Create the `<Card />` component.

This will be our last JSX component, also declared in the `app.vue` file inside the `<script setup>`. It is going to be pretty simple. In this component, we will pass components as slots.

```ts
const Card = (props: { toggleColour: boolean }, components: { slots: any }) => (
    <>
        <div class={"rounded-2xl px-8 py-10 w-80 " + `${props.toggleColour ? "bg-red-800" : "bg-yellow-800"}`}>
            {components.slots.default()}
        </div>
    </>
);
```

We have a prop called `toggleColour` which is a boolean. In this prop, we are going to pass the `isCardRed` reactive `ref` variable that we declared earlier when we declared the `<CardButton />`. We use this `toggleColour` prop in the `<Card />` component to conditionally toggle between two background colours.

Similarly, we are also passing the `components` property, just like we did in the `<CardButton />`, using `components.slots.default()`. This allows us to pass the components that we declare above.

Lastly, we can use the `<Card />` component together with all the components mentioned above like this:

```html
<template>
    <div class="flex justify-center p-4">
        <Card :toggleColour="isCardRed">
            <CardImage
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80"
            />
            <CardDescription name="Lopez Simba" title="Human Resources" />
            <CardButton :action="updateStyle">Switch Colour</CardButton>
        </Card>
    </div>
</template>
```

And that is it. We now have a fully functional `<Card />` using multiple components declared in the same `.vue` file, as well as mixing components between Vue and JSX together while maintaining the same reactivity system.

You can find this example in my GitHub repository at the following [link](https://github.com/Suv4o/Defining-Multiple-Components-in-a-Single-File-in-Nuxt).

## Conclusion

In this blog article, we have demonstrated how to define multiple components in a single `.vue` file in Nuxt using JSX. By using JSX, we can combine regular Vue components and JSX components in the same file, thus utilising the same reactivity system provided by Vue. While it is generally recommended to separate components into individual files, there are situations where declaring small components in the same file can be beneficial. We hope you found this blog article useful. Please subscribe for more articles like this in the future.
