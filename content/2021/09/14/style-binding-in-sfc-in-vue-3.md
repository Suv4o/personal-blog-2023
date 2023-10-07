---
title: Style Binding in SFC in Vue 3
description: For a long time, Vue as a framework had a built-in feature of binding inline styles in HTML templates. But what has changed since the new Vue 3.2 release is that we can now also use the existing v-bind syntax with reactive variables inside our <style> tag in the .vue files aka Single File Components (SFC). Let's take a look how can we do that. With the two examples above, we saw how easy it was to implement a style binding using v-bind syntax in Vue 3.2. But the question is, how has Vue allowed for this? If we inspect the elements in the DevTools of the browser, we will see that all elements used v-bind have their inline styles with CSS variable in them.
image: https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_750,e_sharpen:100/v1631578776/blog/style-binding-in-sfc-in-vue-3/style-binding-in-sfc-in-vue-3
type: article
published: 14th Sep 2021
readTime: 3
author: Aleksandar Trpkovski
articleTags:
    - Vue.js
    - JavaScript
    - CSS
---

# Style Binding in SFC in Vue 3

_{{$document.published}} • {{$document.readTime}} min read — by **[{{$document.author}}](/)**_

::tag-pills{:tags="articleTags"}
::

![blog hero image](https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_750,e_sharpen:100/v1631578776/blog/style-binding-in-sfc-in-vue-3/style-binding-in-sfc-in-vue-3)

For a long time, Vue as a framework had a built-in feature of binding inline styles in HTML templates. But what has changed since the new Vue 3.2 release is that we can now also use the existing `v-bind` syntax with reactive variables inside our `<style>` tag in the `.vue` files aka Single File Components (SFC). Let's take a look how can we do that:

## Binding a Random Color

Firstly, we should declare a reactive variable in the `data` function called `randomColor`.

```js
data() {
    return {
        randomColor: ""
    };
}
```

Next, we declare a method called `getRandomColor()` that returns a random colour.

```js
methods: {
    getRandomColor() {
        return "#" + (((1 << 24) * Math.random()) | 0).toString(16);
    }
}
```

We assign a random colour to the `randomColor` reactive variable when the component has been mounted.

```js
mounted() {
    this.randomColor = this.getRandomColor();
}
```

Now we use `v-bind` syntax within our `<style>` tag to set our colour.

```html
<style scoped>
    .text {
        color: v-bind(randomColor);
    }
</style>
```

Lastly, we create `<h1>` element in our vue template with a class of `class="text"`.

```html
<template>
    <h1 class="text">Hi There!</h1>
</template>
```

Now every time our component re-renders, we will have a different colour on our text.

## Expand the example above with some more styles.

In the previous example, we saw how easy was to bind reactive variables in our `<style>` tag. Now let's add more styles to our example. We are going to create an addition button, so on click a change will be noted with the colour of the text, the size and the colour of the border, as well as the font size of the button. Let's have look on how we can do that:

```js
<script>
export default {
    data() {
        return {
            randomColor: "blue",
            borderStyle: "2px solid red",
            buttonFontSize: "2",
        };
    },
    methods: {
        getRandomColor() {
            return "#" + (((1 << 24) * Math.random()) | 0).toString(16);
        },
        getRandomNumber() {
            return Math.floor(Math.random() * 10) + 1;
        },
        pickStyle() {
            this.randomColor = this.getRandomColor();
            this.borderStyle =
                this.getRandomNumber() + "px solid " + this.getRandomColor();
            this.buttonFontSize = this.getRandomNumber();
        },
    },
};
</script>

<template>
    <h1 class="text">Hi There!</h1>
    <button class="btn" @click="pickStyle">Random color</button>
</template>

<style scoped>
.text {
    color: v-bind(randomColor);
    border: v-bind(borderStyle);
    padding: 20px;
}
.btn {
    cursor: pointer;
    font-size: calc(v-bind(buttonFontSize + "px") * 10);
}
</style>
```

With each click of the button we get different styles. See the gif animation below:

![blog hero image](https://res.cloudinary.com/suv4o/image/upload/c_scale,f_auto,w_750/v1631578836/blog/style-binding-in-sfc-in-vue-3/style-binding-random-colour)

## Conclusion

With the two examples above, we saw how easy it was to implement a style binding using `v-bind` syntax in Vue 3.2. But the question is, how has Vue allowed for this? If we inspect the elements in the DevTools of the browser, we will see that all elements used `v-bind` have their inline styles with CSS variable in them.

```html
<div>
    <h1
        class="text"
        style="--0d3f91e2-randomColor:#a36835; --0d3f91e2-borderStyle:10px solid #3e58fa; --0d3f91e2-buttonFontSize____px_:5px;"
    >
        Hi There!
    </h1>
    <button
        class="btn"
        style="--0d3f91e2-randomColor:#a36835; --0d3f91e2-borderStyle:10px solid #3e58fa; --0d3f91e2-buttonFontSize____px_:5px;"
    >
        Random color
    </button>
</div>
```

So what Vue has done is to assign native CSS variables to each the elements in their inline styles so that Vue can update the values of the variables when needed.

All examples above can be found in the following github repository [link](https://github.com/Suv4o/style-binding-in-single-file-component-in-vue-3).
