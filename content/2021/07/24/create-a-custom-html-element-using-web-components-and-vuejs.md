---
title: Create a custom HTML element using Web Components and Vue.js
description: In this day and age writing reusable components that can be used multiple times in your application or shared between other web platforms can actually save you a lot of time and effort. Web Components offer this benefit and makes it easier to build custom complex components. At the same time, this improves its reusability. Web components are a set of web platform APIs that allow you to create new custom, reusable, encapsulated HTML tags to use in web pages and web apps. Think native HTML elements <div>, <section>, <button>, but something that we can create ourselves with encapsulated functionality that can be reused across modern web browsers or any JavaScript library or framework that works with HTML.
image: https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_1200,e_sharpen:100/v1627371334/blog/create-a-custom-HTML-element-using-Web-Components-and-Vuejs
keywords:
    - Custom HTML element
    - Custom Elements
    - Web Components
    - Web Components and Vue.js
    - Vue.js
    - Vue CLI
    - Frontend
    - Development
    - Web Development
type: page
blog: post
published: 27th Jul 2021
readTime: 9
author: Aleksandar Trpkovski
articleTags:
    - JavaScript
    - FrontEnd
    - Vue.js
---

# Create a custom HTML element using Web Components and Vue.js

_{{$document.published}} • {{$document.readTime}} min read — by **[{{$document.author}}](/)**_

::tag-pills{:tags="articleTags"}
::

![blog hero image](https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_750,e_sharpen:100/v1627371334/blog/create-a-custom-HTML-element-using-Web-Components-and-Vuejs)

In this day and age writing reusable components that can be used multiple times in your application or shared between other web platforms can actually save you a lot of time and effort. Web Components offer this benefit and makes it easier to build custom complex components. At the same time, this improves its reusability.

## What are Web Components?

Web components are a set of web platform APIs that allow you to create new custom, reusable, encapsulated HTML tags to use in web pages and web apps. Think native HTML elements `<div>` `<section>` `<button>`, but something that we can create ourselves with encapsulated functionality that can be reused across modern web browsers or any JavaScript library or framework that works with HTML.

For example, let's imagine that we've created a custom reusable HTML element `<user-register>` and subsequently used this in every web application that we need to register new users. See picture below.

![blog hero image](https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_750,e_sharpen:100/v1627387526/blog/register-form)

We will be creating this component later in the article using Web Components and Vue.js. However, before this takes place, we will need to build a simple web component.

## Create a Web Component

To begin with let's have a look at an example of a custom HTML element created with Web Components.

```js
class CustomElement extends HTMLElement {
    constructor() {
        // Always call super first in constructor
        super();

        // Create a shadow root
        this.attachShadow({ mode: "open" }); // sets and returns 'this.shadowRoot'

        // Create a paragraph with an id of "paragraph"
        const paragraph = document.createElement("p");
        paragraph.id = "paragraph";

        // Create some CSS to apply to the shadow dom
        const style = document.createElement("style");
        style.textContent = `
          p {
           font-size: 42px;
          }`;

        // Attach the created elements to the shadow DOM
        this.shadowRoot.append(style, paragraph);
    }

    connectedCallback() {
        // This runs each time the element is added to the DOM
        const shadow = this.shadowRoot;
        const paragraph = shadow.querySelector("#paragraph");
        paragraph.innerHTML = "This is a paragraph!";
    }
}

customElements.define("custom-element", CustomElement);
```

The JavaScript file defines a class called `CustomElement`, which extends the generic HTMLElement class. We always start by calling `super()` in the class `constructor()` method so that the correct prototype chain is established. Within the constructor, we will define all functionalities of the element when it is initialised.

An important aspect of web components is encapsulation. The Shadow DOM API is a key part of this, as it provides a way to attach a hidden separated DOM to an element. We can attach a shadow root to any element using the `attachShadow()` method with an options object that contains one option `mode` with a value of `open` or `closed`.

After attaching the shadow root to the custom element, we next use some DOM manipulation to create the element's internal shadow DOM structure. In our case, we will create `<p>` HTML element with an id of "**paragraph**" and a `<style>` element with some basic style of `font-size: 42px;` to the paragraph. The final step is to attach all the created elements to the shadow root using `shadowRoot()`.

The actual updates are all handled by the life cycle callbacks, which are placed inside the class definition as methods. The `connectedCallback()` is called after the element is added to the DOM. In our case we added text to the paragraph we created.

Finally, we will register our custom element using the `define()` method. In the parameters, we specify the element name, followed by the class name that defines its functionality.

> **Note:** We can define a few different callbacks inside a custom element's class definition, which fire at different points in the element's lifecycle: `connectedCallback()`, `disconnectedCallback()`, `adoptedCallback()` , `attributeChangedCallback()`. For more details on using the lifecycle callbacks refer to this <a href="https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements" target="_blank" rel="noopener noreferrer">link</a>.

Our custom HTML element is now available to use on our page. We can use the custom element in our HTML like the example below:

```html
<script src="custom-element.js"></script>
...
<body>
    <custom-element />
</body>
```

This will be reflected in the browser:

![blog hero image](https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_750,e_sharpen:100/v1627387526/blog/this-is-a-paragraph)

A full documentation on Web Components can be found on <a href="https://developer.mozilla.org/en-US/docs/Web/Web_Components" target="_blank" rel="noopener noreferrer">MDN Web Docs</a>.

## Create a Web Components with Vue.js

The idea of using Vue.js to build a web component came whilst experimenting with some examples, as I reflected on how could I take advantage of Vue's power to create an efficient web component. It's not to say that we should include Vue.js in every web component we create, but it could be useful in certain cases. It is important to note that Vue.js adds some weight to your component, which might in turn affect your loading speed.

We are going to start by defining a class called `UserRegister`, which extends the generic HTMLElement class.

```js
class UserRegister extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });

    const scriptVue = document.createElement("script");
    scriptVue.src = "https://cdn.jsdelivr.net/npm/vue@2";

    const mainApp = document.createElement("div");
    mainApp.id = "app";

    const componentStyle = document.createElement("style");

    this.shadowRoot.append(scriptVue, mainApp, componentStyle);
  }
```

In the `constructor()` methods we attach the shadow root `attachShadow()` so that we can encapsulate our component from the rest of the document. Next, we create a `<script>` element where we import Vue.js from CDN. We also create `<div>` with an id of "**app**" and a `<style>` element. Lastly we attach all the created elements to the shadow root using `shadowRoot()`.

When our `<user-register>` component is added to the DOM, we should initialise Vue.js and add some styles. We will accomplish that above by calling `connectedCallback()` in our component.

```js
connectedCallback() {
    const shadow = this.shadowRoot;
    this.createVue(shadow);
    this.updateStyle(shadow);
  }
```

Inside `connectedCallback()` we call `createVue()` and `updateStyle()` methods, passing the shadow root parameter. We define these methods inside `UserRegister` class.

```js
createVue(shadow) {
    shadow.querySelector("script").addEventListener("load", () => {
      const template = `
      <form class="card" @submit.prevent="submit">
        <h2 class="text-blue">Register Form</h2>
        <p>This is a custom widget Web Component made with Vue.js.</p>
        <label class="label" for="first"><strong>First Name</strong></label>
        <input v-model="firstName" class="input" id="first" type="text">
        <label class="label" for="last"><strong>Last Name</strong></label>
        <input v-model="lastName" class="input" id="last" type="text">
        <button class="btn" type="submit">Register</button>
        <p class="message">{{ message }}</p>
      </form>`;

      new Vue({
        el: shadow.querySelector("#app"),
        template,
        data: {
          firstName: "",
          lastName: "",
          message: "",
        },
        methods: {
          submit() {
            this.message = `User with name: ${this.fullName} has been registered!`;
            this.firstName = "";
            this.lastName = "";
            setTimeout(() => {
              this.message = "";
            }, 6000);
          },
        },
        computed: {
          fullName() {
            return `${this.firstName} ${this.lastName}`;
          },
        },
      });
    });
  }
```

The `createVue()` method is where we define the Vue logic. First, we select the `<script>` element that we have created in the `constructor()` method, and then wait the Vue.js script to be loaded. Once the script is loaded we continue with our Vue initialisation.

Here we write our template as we normally do in Vue. We then need to tell Vue to render our templet in the `<div>` element with an id of "**app**" that we created earlier in the `constructor()` method. We do that with `el: shadow.querySelector("#app")`. We also add three reactive properties in the data object: `firstName`, `lastName` and `message`, a `submit()` method as well as computed function `fullName()`. For more information on how Vue.js works please refer to the Vue.js documentation in the following <a href="https://vuejs.org/v2/guide/" target="_blank" rel="noopener noreferrer">link</a>.

Next, we add some styles in our component. In the `updateStyle()` method, we should first select the `<style>` element that we created in the `constructor()` , and then set textContent by adding some CSS style.

```js
updateStyle(shadow) {
    shadow.querySelector("style").textContent = `
      .card {
        padding: 16px 30px;
        max-width: 600px;
        box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
      }
      .text-blue {
        color: #2196f3;
      }
      .label {
        display: inline-block;
        margin-top: 8px;
        color: #2196f3;
      }
      .input {
        padding: 8px;
        margin: 2px 0;
        display: block;
        border: 1px solid #ccc;
        width: 100%;
      }
      .btn {
        border: none;
        display: inline-block;
        margin-top: 8px;
        padding: 8px 16px;
        vertical-align: middle;
        overflow: hidden;
        text-decoration: none;
        color: #fff;
        background-color: #2196f3;
        text-align: center;
        cursor: pointer;
        white-space: nowrap;
      }
      .message {
        color: #2196f3;
        font-weight: bold;
        text-align: center;
      }`;
  }
```

Finally, we register our custom element using the `define()` method. In the parameters, we specify the element name, and then the class name that defines its functionality.

```js
customElements.define("user-register", UserRegister);
```

That's it! Our custom `<user-register>` element is now ready to be used on our page. We can use it in our HTML like the example below:

```html
<script src="user-register.js"></script>
...
<body>
    <user-register />
</body>
```

> **Note:** Now when we have created a Web Components with Vue.js, how can we compare the Web Components lifecycles to Vue.js lifecycles hooks: `constructor()` = `created()`, `connectedCallback()` = `mounted()`, `attributeChangedCallback()` = `beforeUpdate()` and `disconnectedCallback()` = `destroyed()`.

## Create Web Component with Vue-CLI

Vue-CLI version 3 and above allow for us to export our Vue.js components into Web Components. All we're required to do is to add a build target in **`package.json`** file. More details on building targets can be found in the following <a href="https://cli.vuejs.org/guide/build-targets.html#library" target="_blank" rel="noopener noreferrer">link</a>.

In the **`package.json`** we add the following line of code:

```json
"scripts": {
	"wc": "vue-cli-service build --target wc --inline-vue --name custom-component ./src/components/custom-component.vue"
}
```

And then we run the following script in the console:

```
npm run wc
```

The heavy work is already done by Vue-CLI. We now can use our custom component in our HTML like the example below:

```html
<script src="custom-component.js"></script>
...
<body>
    <custom-component />
</body>
```

## Conclusion

1. Web components are a set of web platform APIs that allow us to create new custom, reusable, encapsulated HTML tags to use in web pages and web apps.
2. Web Components are native HTML elements such as `<div>` `<section>` `<button>`, but something that we can create ourselves with encapsulated functionality that can be reused across modern web browsers.
3. An important aspect of web components is encapsulation. The Shadow DOM API is a key part of this, providing a way to attach a hidden separated DOM to an element.
4. We can take advantage of Vue's power to create efficient web components. However, we should be aware of it's size, as it affects the loading speed of the component.
5. The Vue-CLI version 3 and above allow us to export our Vue.js components into Web Components. The heavy lifting would be carried out by Vue-CLI.

All examples above can be found in the following github repository <a href="https://github.com/Suv4o/Web-Components-and-Vue.js" target="_blank" rel="noopener noreferrer">link</a>.
