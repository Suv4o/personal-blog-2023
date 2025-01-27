---
title: A Beginner's Guide to Vue for React Developers
description: A comprehensive guide for React developers transitioning to Vue. Learn the differences in components, styling, state management, lifecycle hooks, and more. Master Vue concepts quickly with React comparisons. We will dive into Vue's unique features, like the ref and reactive functions, v-if directives, and computed properties, make it a powerful alternative to React. Whether you're a React developer exploring Vue or simply curious about its differences, this guide provides practical examples and insights to get you started.
image: https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_1200,e_sharpen:100/v1736935516/blog/a-beginners-guide-to-vue-for-react-developers/A_scenic_landscape_featuring_a_slightly_curved_road_that_extends_infinitely_into_the_horizon._The_road_starts_with_a_vibrant_blue_hue_and_gradually_tr
keywords:
    - React.js
    - Vue.js
    - Reactivity in Vue.js
    - Reactivity in React.js
    - Reactivity
    - Vue 3
    - v-model
    - Web Development
    - Development
    - JavaScript reactivity
    - Reactive programming
    - Vue.js reactivity
    - Two-way data binding
    - Vue for React developers
    - React to Vue transition
    - Vue beginner guide
    - React vs Vue comparison
    - Vue vs React components
    - Vue state management
    - Vue lifecycle hooks
    - Vue reactivity
    - Vue templates
    - Vue scoped styles
    - Vue conditional rendering
    - Vue computed properties
    - React vs Vue props
    - Vue slots
    - React CSS Modules
    - Vue styled-components alternative
    - Vue frontend framework
    - Vue directive examples
    - Vue reactive variables
    - Vue ref vs React useState
    - Vue hooks
    - transitioning from React to Vue
type: page
blog: post
published: 15th January 2025
readTime: 12
author: Aleksandar Trpkovski
articleTags:
    - JavaScript
    - Vue.js
    - React.js
---

# A Beginner's Guide to Vue for React Developers

_{{$document.published}} • {{$document.readTime}} min read — by **[{{$document.author}}](/)**_

::tag-pills{:tags="articleTags"}
::

![Landing Image](https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_750,e_sharpen:100/v1736935516/blog/a-beginners-guide-to-vue-for-react-developers/A_scenic_landscape_featuring_a_slightly_curved_road_that_extends_infinitely_into_the_horizon._The_road_starts_with_a_vibrant_blue_hue_and_gradually_tr)

Vue is a frontend framework that shares many concepts with React while taking its own unique approach. This guide will walk you through Vue's key concepts and compare them to their React equivalents. By the end, you'll have a solid foundation for working with Vue.

## Setting Up a Component

### React

In React, a functional component is created like this:

```jsx
function ExampleComponent() {
    return <h1>Hello, React!</h1>;
}

export default ExampleComponent;
```

### Vue

In Vue, components are defined with a template and a script:

```html
<script setup></script>

<template>
    <h1>Hello, Vue!</h1>
</template>
```

**Key Differences:**

- Vue components are defined in files with the `.vue` extension.
- Vue separates logic (`script`) and markup (`template`).
- Vue doesn't require JSX, instead, you write HTML-like syntax directly in the `template` section of your `.vue` file.

## Styling Components

Now that we've set up our components, let’s explore how to style them. Styling components in React and Vue can be done in multiple ways, including:

### **Inline Styles**

Both React and Vue support inline styles, though their syntax differs slightly.

### **React**

```jsx
function ExampleComponent() {
    const inlineStyle = { color: "blue", fontSize: "20px" };

    return <h1 style={inlineStyle}>Hello, React!</h1>;
}

export default ExampleComponent;
```

### **Vue**

```html
<script setup>
    const inlineStyle = { color: "blue", fontSize: "20px" };
</script>

<template>
    <h1 :style="inlineStyle">Hello, Vue!</h1>
</template>
```

In Vue, `:style` is a directive used for binding styles.

### External Styles

External styles involve creating a separate CSS file and importing it.

### **React**

You can create a `ExampleComponent.css` file and import it into your component:

```jsx
import "./ExampleComponent.css";

function ExampleComponent() {
    return <h1 className="header">Hello, React!</h1>;
}

export default ExampleComponent;
```

**ExampleComponent.css:**

```css
.header {
    color: blue;
    font-size: 20px;
}
```

### Vue

In Vue, styles can be added directly to the `.vue` file in a `<style>` block:

```html
<script setup></script>

<template>
    <h1 class="header">Hello, Vue!</h1>
</template>

<style>
    .header {
        color: blue;
        font-size: 20px;
    }
</style>
```

**Key Differences:**

- Vue uses `class` attribute for CSS classes, while React uses `className` (since `class` is a reserved word in JavaScript).

### Scoped Styles (Vue-Specific)

Vue provides a scoped styling feature to limit styles to the component they belong to.

```html
<script setup></script>

<template>
    <h1 class="header">Hello, Vue!</h1>
</template>

<style scoped>
    .header {
        color: blue;
        font-size: 20px;
    }
</style>
```

**What are scoped styles in Vue?**

- Adding the `scoped` attribute to a `style` tag in Vue automatically assigns unique attributes to the component's HTML elements, ensuring styles only apply within that component.
- This prevents style conflicts across components while maintaining all styling code in a single file.

### **React's Approach to** Scoped Styles

While React doesn't include built-in scoped styles, you can achieve similar functionality natively with CSS Modules or by using the styled-components library to isolate styles to specific components.

**React CSS Modules:**

React supports **CSS Modules**, which are a way to scope CSS to a specific component. With CSS Modules, the class names are automatically locally scoped by appending unique names. Here’s an example:

**Card.module.css**

```css
.header {
    color: blue;
    font-size: 20px;
}
```

**Card.jsx**

```jsx
import styles from "./Card.module.css";

const Card = () => <div className={styles.header}>Hello, React!</div>;

export default Card;
```

**Styled-Components (CSS-in-JS)**

For a more dynamic and scoped styling experience, you can use libraries like **Styled-Components**. It allows you to define component-scoped styles directly within your JavaScript files:

```jsx
import styled from "styled-components";

const Header = styled.h1`
    color: blue;
    font-size: 20px;
`;

const Card = () => <Header>Hello, React!</Header>;

export default Card;
```

## State Management with Reactivity

### React

React uses `useState` for state management:

```jsx
import { useState } from "react";

function ExampleComponent() {
    const [count, setCount] = useState(0);

    return (
        <div>
            <p>Count: {count}</p>
            <button onClick={() => setCount(count + 1)}>Increment</button>
        </div>
    );
}

export default ExampleComponent;
```

For more complex state logic, React uses the `useReducer` hook. It is ideal when state updates involve multiple sub-values or actions.

```jsx
import { useReducer } from "react";

function reducer(state, action) {
    switch (action.type) {
        case "increment":
            return { count: state.count + 1 };
        case "decrement":
            return { count: state.count - 1 };
        default:
            throw new Error();
    }
}

function Counter() {
    const [state, dispatch] = useReducer(reducer, { count: 0 });

    return (
        <div>
            <p>Current count: {state.count}</p>
            <button onClick={() => dispatch({ type: "increment" })}>Increment</button>
            <button onClick={() => dispatch({ type: "decrement" })}>Decrement</button>
        </div>
    );
}

export default Counter;
```

To derive state based on other variables, React uses memoisation with `useMemo`. This hook optimises performance by storing computed values and preventing unnecessary recalculations when dependencies haven't changed.

```jsx
import { useState, useMemo } from "react";

function DoubleCounter() {
    const [count, setCount] = useState(0);

    // Derived state
    const doubleCount = useMemo(() => count * 2, [count]);

    return (
        <div>
            <p>Count: {count}</p>
            <p>Double Count: {doubleCount}</p>
            <button onClick={() => setCount(count + 1)}>Increment</button>
        </div>
    );
}

export default DoubleCounter;
```

### Vue

In Vue, you use `ref` to manage state reactively:

```html
<script setup>
    import { ref } from "vue";

    const count = ref(0);
</script>

<template>
    <div>
        <p>Count: {{ count }}</p>
        <button @click="count++">Increment</button>
    </div>
</template>
```

Alternatively you can use `reactive` function to creates a reactive object, which is useful for managing more complex state (e.g., multiple related properties).

```html
<script setup>
    import { reactive } from "vue";

    const state = reactive({
        count: 0,
        message: "Hello, Vue 3!",
    });

    const increment = () => {
        state.count++;
    };

    const updateMessage = () => {
        state.message = "You updated the message!";
    };
</script>

<template>
    <div>
        <p>Count: {{ state.count }}</p>
        <p>Message: {{ state.message }}</p>
        <button @click="increment">Increment</button>
        <button @click="updateMessage">Change Message</button>
    </div>
</template>
```

In Vue you can derive state with `computed` function, which automatically updates when its dependencies change.

```html
<script setup>
    import { ref, computed } from "vue";

    const count = ref(0);

    const doubleCount = computed(() => count.value * 2);

    const increment = () => {
        count.value++;
    };
</script>

<template>
    <div>
        <p>Count: {{ count }}</p>
        <p>Double Count: {{ doubleCount }}</p>
        <button @click="increment">Increment</button>
    </div>
</template>
```

**Key Differences:**

- Vue uses `ref` for creating reactive variables.
- For objects with multiple properties, Vue's `reactive` function is more appropriate.
- Use `computed` properties to create derived or computed state.
- When working in the `script` section, always access `ref` values with `.value`.
- Vue uses double curly braces `{{ }}` for data binding in templates. Unlike in the `script` section, you don't need to manually unwrap reactive values in templates.
- Vue uses a Proxy-based reactivity system that offers several advantages over React. Vue uses Proxies to observe changes in reactive objects and automatically track dependencies, allowing it to detect mutations directly. React, in contrast, relies on explicit updates (via `setState` or similar) and immutable data structures to trigger reactivity, avoiding deep observation of objects.

## Two-Way Binding with `v-model`

In Vue, `v-model` simplifies two-way data binding between form inputs and reactive variables. This feature is intuitive and eliminates the need for explicit event listeners and state updates, as commonly done in React.

### React

React does not have built-in two-way binding. Instead, developers manually link the state to the input’s value and use event handlers to update the state:

```jsx
import { useState } from "react";

function TwoWayBindingExample() {
    const [inputValue, setInputValue] = useState("");

    const handleChange = (event) => {
        setInputValue(event.target.value);
    };

    return (
        <div>
            <input value={inputValue} onChange={handleChange} placeholder="Type something..." />
            <p>You typed: {inputValue}</p>
        </div>
    );
}

export default TwoWayBindingExample;
```

In Vue, using `v-model` is straightforward. It automatically binds the input’s value to a reactive variable and updates the variable whenever the input changes.

### Vue

```html
<script setup>
    import { ref } from "vue";

    const inputValue = ref("");
</script>

<template>
    <div>
        <input v-model="inputValue" placeholder="Type something..." />
        <p>You typed: {{ inputValue }}</p>
    </div>
</template>
```

**Key Differences**

- Vue offers cleaner syntax with `v-model`, while React needs manual event handling

## Lifecycle Hooks

### React

React’s lifecycle hooks like `useEffect` handle mount and unmount logic:

```jsx
import { useEffect } from "react";

function ExampleComponent() {
    useEffect(() => {
        console.log("Component mounted");

        return () => {
            console.log("Component unmounted");
        };
    }, []);

    return <div>Lifecycle example</div>;
}

export default ExampleComponent;
```

### Vue

Vue provides lifecycle hooks like `onMounted` and `onUnmounted`:

```html
<script setup>
    import { onMounted, onUnmounted } from "vue";

    onMounted(() => {
        console.log("Component mounted");
    });

    onUnmounted(() => {
        console.log("Component unmounted");
    });
</script>

<template>
    <div>Lifecycle example</div>
</template>
```

**Key Differences:**

- Vue uses separate lifecycle hooks such as `onMounted` and `onUnmounted` to handle lifecycle events.

## Watching and Tracking Changes

### React

React doesn’t have watchers; you use `useEffect`:

```jsx
import { useState, useEffect } from "react";

function ExampleComponent() {
    const [count, setCount] = useState(0);

    useEffect(() => {
        console.log("Count changed:", count);
    }, [count]);

    return <button onClick={() => setCount(count + 1)}>Increment</button>;
}
```

### Vue

Vue provides a `watch` function to observe changes:

```html
<script setup>
    import { ref, watch } from "vue";

    const count = ref(0);

    watch(count, (newValue) => {
        console.log("Count changed:", newValue);
    });
</script>

<template>
    <button @click="count++">Increment</button>
</template>
```

**Key Differences:**

- Vue’s `watch` directly observes reactive variables.

## Conditional Rendering

### React

React uses JavaScript expressions or ternary operators:

```jsx
function ExampleComponent() {
    const isLoggedIn = true;

    return <p>{isLoggedIn ? "Welcome back!" : "Please log in."}</p>;
}
```

### Vue

Vue uses directives like `v-if` and `v-else`:

**Key Differences:**

- Vue uses declarative directives (`v-if`, `v-else`) for conditional rendering.

```html
<script setup>
    const isLoggedIn = true;
</script>

<template>
    <p v-if="isLoggedIn">Welcome back!</p>
    <p v-else>Please log in.</p>
</template>
```

## Passing Props to Child Components

### **React**

In React, props are passed by adding attributes to the child component in the parent component. The child component accesses these props through the `props` parameter.

**Parent Component**

```jsx
function Parent() {
    return <Child message="Hello from Parent!" />;
}

export default Parent;
```

**Child Component**

```jsx
function Child(props) {
    return <h1>{props.message}</h1>;
}

export default Child;
```

### **Vue**

In Vue, props are passed in a similar way by using attributes on the child component in the parent. However, the child component explicitly defines the props it expects.

**Parent Component**

```html
<script setup>
    import Child from "./Child.vue";
</script>

<template>
    <Child message="Hello from Parent!" />
</template>
```

**Child Component**

```html
<script setup>
    defineProps({
        message: String,
    });
</script>

<template>
    <h1>{{ message }}</h1>
</template>
```

**Key Differences**

- Vue requires explicit prop definitions using `defineProps`, while React doesn't require prop declarations
- Vue allows direct access to props as variables in the`template`section, while React requires accessing them through the props object unless they are destructured.
- Vue has built-in prop type checking with `defineProps`, while React relies on PropTypes or TypeScript

## Passing Components in Slots

### React

React uses children props for dynamic content:

```jsx
function Modal({ children }) {
    return <div className="modal">{children}</div>;
}

function ExampleComponent() {
    return (
        <Modal>
            <h1>Modal Content</h1>
        </Modal>
    );
}
```

### Vue

In Vue, components need to be declared in separate files. We use the `<slot>` component as a placeholder where we expect the child component to be passed.

**Modal Component (`Modal.vue`)**

```html
<template>
    <div class="modal">
        <slot></slot>
    </div>
</template>
```

**Parent Component**

```html
<script setup>
    import Modal from "./Modal.vue";
</script>

<template>
    <Modal>
        <h1>Modal Content</h1>
    </Modal>
</template>
```

**Vue Named Slots:**

With Vue named slots, we can define multiple slot places in the parent component and pass different children.

**`Modal.vue`**

```html
<template>
    <div class="modal">
        <slot name="header"></slot>
        <slot></slot>
    </div>
</template>
```

**Parent Component**

```html
<template>
    <Modal>
        <template #header>
            <h1>Modal Header</h1>
        </template>
        <p>Modal Body</p>
    </Modal>
</template>
```

**Key Differences:**

- Vue’s `slot` allows for flexible content placement within components.

## Handling Events Between Parent and Child Components

### React

React passes functions as props to children:

```jsx
function Child({ onClick }) {
    return <button onClick={onClick}>Click me</button>;
}

function ExampleComponent() {
    const handleClick = () => alert("Button clicked!");
    return <Child onClick={handleClick} />;
}
```

### Vue

Vue uses `emit` for event communication:

**Children Component**

```html
<script setup>
    const emit = defineEmits(["clicked"]);
</script>

<template>
    <button @click="emit('clicked')">Click me</button>
</template>
```

**Parent Component**

```html
<script setup>
    import Children from "./Children.vue";

    const handleClick = () => console.log("Button clicked!");
</script>

<template>
    <Children @clicked="handleClick" />
</template>
```

**Key Differences:**

- Vue’s `emit` is designed for child-to-parent communication.

## Accessing DOM Elements with Refs

### React

React uses `useRef` to access DOM elements:

```jsx
import { useRef } from "react";

function ExampleComponent() {
    const inputRef = useRef();

    const focusInput = () => {
        inputRef.current.focus();
    };

    return (
        <div>
            <input ref={inputRef} type="text" />
            <button onClick={focusInput}>Focus Input</button>
        </div>
    );
}
```

### Vue

Vue uses template refs to access DOM elements:

```html
<script setup>
    import { ref } from "vue";

    const inputRef = ref();

    const focusInput = () => {
        inputRef.value.focus();
    };
</script>

<template>
    <div>
        <input ref="inputRef" type="text" />
        <button @click="focusInput">Focus Input</button>
    </div>
</template>
```

**Key Differences:**

- Vue’s `ref` is bound to DOM elements using the `ref` attribute in templates.
- Access the element via `ref.value`.

## Reusable Logic

### React

React uses custom hooks for reusable logic:

```jsx
function useCounter() {
    const [count, setCount] = useState(0);
    const increment = () => setCount(count + 1);
    return { count, increment };
}

function ExampleComponent() {
    const { count, increment } = useCounter();

    return <button onClick={increment}>Count: {count}</button>;
}
```

### Vue

Vue uses composables for reusable logic:

`composables/useCounter.js`

```jsx
import { ref } from "vue";

export function useCounter() {
    const count = ref(0);
    const increment = () => count.value++;
    return { count, increment };
}
```

`Component.vue`

```html
<script setup>
    import { useCounter } from "./composables/useCounter";

    const { count, increment } = useCounter();
</script>

<template>
    <button @click="increment">Count: {{ count }}</button>
</template>
```

**Key Differences:**

- Composables are plain functions that return reactive state and methods.
- They are imported and used like hooks in React.
- Even though React hooks and Vue composables are very similar, they work fundamentally differently under the hood. For example:
    - In Vue, the reactive state defined in a composable is shared and persistent when imported across multiple components. This allows composables to act as a lightweight state management solution, eliminating the need for external libraries like Redux for many use cases.
    - Vue composables do not rely on a component's lifecycle or context, unlike React hooks which must be used within a component or another hook. This makes composables more flexible and usable in non-component logic like services or standalone utilities.

### Shared State Between Components with Vue Composables

Here’s an example of a Vue composable that creates a shared counter state. This composable will be imported and used in two different components, and the state (`count`) will be persistent across both components:

`composables/useSharedCounter.js`

```jsx
import { ref } from "vue";

const count = ref(0);

export function useSharedCounter() {
    const increment = () => count.value++;
    const decrement = () => count.value--;
    return { count, increment, decrement };
}
```

`ComponentA.vue`

```html
<script setup>
    import { useSharedCounter } from "./composables/useSharedCounter";

    const { count, increment } = useSharedCounter();
</script>

<template>
    <div>
        <h2>Component A</h2>
        <button @click="increment">Increment in A</button>
        <p>Count: {{ count }}</p>
    </div>
</template>
```

`ComponentB.vue`

```html
<script setup>
    import { useSharedCounter } from "./composables/useSharedCounter";

    const { count, decrement } = useSharedCounter();
</script>

<template>
    <div>
        <h2>Component B</h2>
        <button @click="decrement">Decrement in B</button>
        <p>Count: {{ count }}</p>
    </div>
</template>
```

Both `ComponentA` and `ComponentB` in your app, they will share the same `count` state, and any changes in one will be reflected in the other.

## **Conclusion**

Vue and React both excel in building modern web applications, but they take different paths. Vue's declarative syntax, reactivity, and lifecycle hooks make it approachable for beginners, at least in my experience. Having spent considerable time with both frameworks, I believe that while their approaches differ, they share core concepts and offer similar features.

This guide only scratches the surface. More advanced features like Vue Router and state management with Pinia are beyond the scope of this beginner's guide, but you can explore them at your own pace.

Happy coding!

The code for this is available in the following GitHub repository [here](https://github.com/Suv4o/a-beginners-guide-to-vue-for-react-developers).
