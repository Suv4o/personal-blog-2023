---
title: Is it possible to use "<nuxt-link>" in content rendered with "v-html"?
description: If you've used Vue or Nuxt, you're likely familiar with the "v-html" directive. This is used to dynamically insert HTML content into an element. It takes a string value containing HTML tags and text, replacing the inner HTML of the target element with this content. One limitation of "v-html" is that it does not allow you to render "<nuxt-link>". Instead, all "<a>" HTML tags do not use the native Vue router. However, we can address this limitation by writing our own directive. This will allow all "<a>" tags to be converted into "<nuxt-link>". Thanks to Nuxt and its plugin system, we can easily expand the functionality of Nuxt. Let's get started.
image: https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_1200,e_sharpen:100/v1711259337/blog/Is%20it%20possible%20to%20use%20nuxt-link%20in%20content%20rendered%20with%20v-html/aktookoffk14wzluq2er
keywords:
    - Nuxt.js
    - Vue.js
    - TypeScript
    - JavaScript
    - Vue Directives
    - v-html
    - Nuxt-link
    - Vue Router
    - Render html content
    - Web Development
    - Development
type: page
blog: post
published: 24th March 2024
readTime: 6
author: Aleksandar Trpkovski
articleTags:
    - Nuxt.js
    - Vue.js
    - TypeScript
---

# Is it possible to use `<nuxt-link>` in content rendered with `v-html`?

_{{$document.published}} • {{$document.readTime}} min read — by **[{{$document.author}}](/)**_

::tag-pills{:tags="articleTags"}
::

![Landing Image](https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_750,e_sharpen:100/v1711259337/blog/Is%20it%20possible%20to%20use%20nuxt-link%20in%20content%20rendered%20with%20v-html/aktookoffk14wzluq2er)

If you've used Vue or Nuxt, you're likely familiar with the `v-html` directive. This is used to dynamically insert HTML content into an element. It takes a string value containing HTML tags and text, replacing the inner HTML of the target element with this content.

One limitation of `v-html` is that it does not allow you to render `<nuxt-link>`. Instead, all `<a>` HTML tags do not use the native Vue router.

However, we can address this limitation by writing our own directive. This will allow all `<a>` tags to be converted into `<nuxt-link>`.

Thanks to Nuxt and its plugin system, we can easily expand the functionality of Nuxt. Let's get started.

## Create a Nuxt plugin

Within the root of your Nuxt application, create a `/plugins` directory. In this directory, create a file named `nuxt-html.ts`. The following logic will be added to this file:

```ts
export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.directive("nuxtHtml", {
        mounted(el: HTMLElement, binding) {
            el.innerHTML = assignAnchorsIds(binding.value);
            convertAnchorToNuxtLink(el);
        },
        updated(el, binding) {
            el.innerHTML = assignAnchorsIds(binding.value);
            convertAnchorToNuxtLink(el);
        },
        unmounted() {
            removeListeners();
        },
    });
});
```

Let's break down the code above to understand each part:

- **`defineNuxtPlugin`:** This function creates a Nuxt plugin, making its features available throughout the application.
- **`nuxtApp.vueApp.directive`:** This registers a custom Vue directive called `nuxtHtml`. We can use `v-nuxt-html` later in the `.vue` file.

**Directive Lifecycle Hooks:**

- **`mounted`:** Executes when the element using the directive is inserted into the DOM.
- **`updated`:** Executes when the value bound to the directive changes.
- **`unmounted`:** Executes when the element is removed from the DOM.

Next, let's examine the key functions we'll use within our directive: `assignAnchorsIds`, `convertAnchorToNuxtLink`, and `removeListeners`. We'll add these functions in the `nuxt-html.ts`, above the plugin definition.

```ts
const idsWithListeners = new Set<string>();

function generateUuid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0,
            v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

function assignAnchorsIds(html: string) {
    const domParser = new DOMParser();
    const doc = domParser.parseFromString(html, "text/html");
    const anchors = doc.querySelectorAll("a");

    anchors.forEach((anchor) => {
        if (!anchor.hasAttribute("id")) {
            anchor.setAttribute("id", generateUuid());
        }
    });
    return doc.documentElement.outerHTML;
}

function convertAnchorToNuxtLink(html: HTMLElement) {
    const anchors = html.querySelectorAll("a");

    anchors.forEach((anchor) => {
        if (anchor.id && !idsWithListeners.has(anchor.id)) {
            const link = document.getElementById(anchor.id);

            link?.addEventListener("click", (event) => {
                event.preventDefault();
                const to = anchor.getAttribute("href");
                if (to) {
                    useNuxtApp().$router.push(to);
                }
            });

            // Add the ID to the Set
            idsWithListeners.add(anchor.id);
        }
    });
}

function removeListeners() {
    idsWithListeners.forEach((id) => {
        const link = document.getElementById(id);
        link?.removeEventListener("click", () => {});
        idsWithListeners.delete(id);
    });
}
```

Now, let's delve into the specifics of each function and understand how they contribute to the overall functionality of the directive.

- **`assignAnchorsIds`:**
    - Parses the provided HTML string into a DOM document.
    - Identifies anchor elements (`<a>`) without IDs.
    - Assigns unique IDs (using `generateUuid`) to those anchors for tracking and linking.
    - Returns the modified HTML string.
- **`convertAnchorToNuxtLink`:**
    - Finds anchor elements within a given HTML element.
    - Identifies anchors with IDs that haven't been handled yet.
    - Attaches click event listeners to those anchors:
        - Prevents default browser behaviour (page reload).
        - Retrieves the anchor's `href` attribute.
        - Utilises Nuxt's `$router` to programmatically navigate to the specified route, effectively converting basic anchors into Nuxt-powered navigation links.
- **`removeListeners`:**
    - Iterates through the IDs of anchors with event listeners.
    - Removes the click event listeners to prevent memory leaks or unintended behaviour.

## Using the `v-nuxt-html` directive

Now, we can use our `v-nuxt-html` as follows in our `.vue` file:

```html
<script setup lang="ts">
    const htmlString = ref(`
<h1>Example Heading</h1>
<p>Example Paragraph</p>
<a href="/example-1">Example 1</a>
<a href="/example-2">Example 2</a>
<a href="/example-3">Example 3</a>`);

    onMounted(() => {
        setTimeout(() => {
            htmlString.value = `
            <h1>Example Heading</h1>
            <p>Example Paragraph</p>
            <a href="/example-1">Example 1</a>
            <a href="/example-2">Example 2</a>
            <a href="/example-3">Example 3</a>
            <a href="/example-4">Example 4</a>`;
        }, 4000);
    });
</script>

<template>
    <div>
        <div v-nuxt-html="htmlString"></div>
    </div>
</template>
```

Alright, let's break down the code above piece by piece, so we can get a good grasp on how everything fits together.

- **Dynamic HTML Content:** The code defines a `ref` named `htmlString` that holds HTML content as a string. This allows for dynamic updates to the displayed HTML.
- **Initial Render:**
    - The template section includes a `div` element containing another `div` with the `v-nuxt-html` directive applied.
    - When the component mounts, the initial value of `htmlString` (defined in the `script setup` section) is used.
    - The `v-nuxt-html` directive intercepts this and performs the following actions:
        - It parses the HTML string using the `assignAnchorsIds` function. This ensures any anchor (`<a>`) elements without IDs are assigned unique ones.
        - It then calls the `convertAnchorToNuxtLink` function. This function finds the anchors within the parsed HTML and attaches click event listeners to them.
        - When an anchor with a `href` attribute is clicked, the event listener:
            - Prevents default behavior (stopping the browser from navigating away from the current page).
            - Extracts the `href` attribute value (e.g., `/example-1`).
            - Uses Nuxt's router (`$router`) to programmatically navigate to the specified route, effectively turning the anchor into a Nuxt link.
- **Dynamic Update:** After a 4-second delay using `setTimeout`, the `htmlString` is updated with a new string containing an additional anchor element (`<a href="/example-4">Example 4</a>`).
- **Re-rendering and Event Listener Management:**
    - The component re-renders due to the change in `htmlString`.
    - The `v-nuxt-html` directive again parses and processes the updated HTML.
    - Importantly, the directive's `unmounted` lifecycle hook ensures any previously attached event listeners are removed using the `removeListeners` function. This prevents memory leaks and unintended behavior when the HTML content changes.

## Conclusion

Using the `v-html` directive in a Nuxt application has a limitation - it doesn't render `<nuxt-link>`. You can overcome this by creating a custom Vue directive named `v-nuxt-html`. This directive helps convert all `<a>` HTML tags into `<nuxt-link>` behaviour, enabling dynamic, interactive HTML content in a Nuxt application. The code for this is available in the following GitHub repository [here](https://github.com/Suv4o/nuxt-link-with-v-html).
