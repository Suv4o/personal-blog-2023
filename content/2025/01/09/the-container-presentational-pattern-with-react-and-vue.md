---
title: The Container/Presentational Pattern with React and Vue
description: This blog post dives into the Container/Presentational Pattern, demonstrating how to create cleaner, more modular, and reusable code with React Hooks and Vue 3 Composables. Explore how to modernise this classic frontend pattern by transitioning from traditional implementations to scalable, maintainable solutions. Perfect for developers looking to streamline logic, enhance maintainability, and build better React and Vue applications.
image: https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_1200,e_sharpen:100/v1736332534/blog/the-container-presentational-pattern-with-react-and-vue/the-container-presentational-pattern-with-react-and-vue_tx5c9t
keywords:
    - React.js
    - Vue.js
    - Vue 3
    - Web Development
    - Development
    - Container/Presentational Pattern
    - React Hooks
    - Vue 3 Composables
    - frontend development patterns
    - modern frontend design
    - reusable components
    - state management
    - React custom hooks
    - Vue composable functions
    - separating UI and logic
    - modular components
    - clean code in React
    - clean code in Vue
    - frontend architecture
    - React patterns
    - Vue 3 patterns
    - scalable frontend design
    - reusable frontend logic
type: article
published: 9th January 2025
readTime: 6
author: Aleksandar Trpkovski
articleTags:
    - React.js
    - Vue.js
    - JavaScript
---

# The Container/Presentational Pattern with React and Vue

_{{$document.published}} • {{$document.readTime}} min read — by **[{{$document.author}}](/)**_

::tag-pills{:tags="articleTags"}
::

![Landing Image](https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_750,e_sharpen:100/v1736332534/blog/the-container-presentational-pattern-with-react-and-vue/the-container-presentational-pattern-with-react-and-vue_tx5c9t)

The **Container/Presentational Pattern** is a fundamental concept in frontend development. By separating logic and UI, it creates clean, reusable, and testable components. Traditionally, this pattern was implemented using "container components" to manage state and "presentational components" to handle UI rendering. However, modern tools like **React Hooks** and **Vue Composables** provide an alternative, more modular way to achieve the same goals, without relying on explicit container components.

In this blog post, we’ll:

1. Explore the traditional implementation of the Container/Presentational Pattern in **React** and **Vue**.
2. Enhance the pattern using **Hooks** and **Composables** for a cleaner, reusable design approach.

## **Introduction to the Container/Presentational Pattern**

The Container/Presentational Pattern divides components into two types:

1. **Presentational Components**:
    - Focus on rendering the UI.
    - Receive data via props.
    - Are stateless and reusable across different contexts.
2. **Container Components**:
    - Manage state, handle logic, and perform data fetching.
    - Pass data to presentational components.

This separation of concerns promotes maintainability and reusability. However, in modern frameworks like React and Vue, container components can be replaced by **Hooks** and **Composable functions**, encapsulating logic in reusable, framework-specific utilities.

## **React Implementation with Traditional Container Components**

### Presentational Component - `Card.jsx`

The `Card` component in React is focused purely on displaying user information:

```jsx
function Card({ data }) {
    return (
        <div className="card">
            <h2>{data.name}</h2>
            <p>Age: {data.age}</p>
        </div>
    );
}

export default Card;
```

### Presentational Component - `Details.jsx`

Similarly, the `Details` component handles additional user details:

```jsx
function Card({ data }) {
    return (
        <div className="card">
            <p>Email: {data.email}</p>
            <p>Address: {data.address}</p>
            <p>City: {data.city}</p>
            <p>State: {data.state}</p>
            <p>Zip: {data.zip}</p>
            <p>Phone: {data.phone}</p>
            <p>Occupation: {data.occupation}</p>
            <p>Company: {data.company}</p>
            <p>Hobbies: {data.hobbies?.join(", ")}</p>
            <p>Website: {data.website}</p>
        </div>
    );
}

export default Card;
```

### Container Component - `DataContainer.jsx`

The `DataContainer` component manages data fetching and distributes the fetched data to child components.

```jsx
import { useState, useEffect, Children, cloneElement } from "react";

function DataContainer({ children }) {
    const [data, setData] = useState(null);

    useEffect(() => {
        // Simulating data fetching
        setTimeout(() => {
            setData({
                name: "John Doe",
                age: 30,
                email: "john.doe@example.com",
                address: "123 Main St",
                city: "Anytown",
                state: "CA",
                zip: "12345",
                phone: "555-1234",
                occupation: "Software Developer",
                company: "Tech Corp",
                hobbies: ["reading", "gaming", "hiking"],
                website: "https://johndoe.com",
            });
        }, 1000);
    }, []);

    return <>{children && Children.map(children, (child) => cloneElement(child, { data }))}</>;
}

export default DataContainer;
```

### Using the Components Together

```jsx
import Card from "./components/Card";
import Details from "./components/Details";
import DataContainer from "./components/DataContainer";

function App() {
    return (
        <>
            <DataContainer>
                <Card />
                <Details />
            </DataContainer>
        </>
    );
}

export default App;
```

## Vue 3 Implementation with Traditional Container Components

### Presentational Component - `Card.vue`

The `Card` component in Vue focuses on rendering basic user information:

```html
<script setup>
    import { defineProps } from "vue";

    defineProps({
        data: Object,
    });
</script>

<template>
    <div class="card">
        <h2>{{ data.name }}</h2>
        <p>Age: {{ data.age }}</p>
    </div>
</template>
```

### Presentational Component - `Details.vue`

The `Details` component renders additional user details:

```html
<script setup>
    import { defineProps } from "vue";

    defineProps({
        data: Object,
    });
</script>

<template>
    <div class="card">
        <p>Email: {{ data.email }}</p>
        <p>Address: {{ data.address }}</p>
        <p>City: {{ data.city }}</p>
        <p>State: {{ data.state }}</p>
        <p>Zip: {{ data.zip }}</p>
        <p>Phone: {{ data.phone }}</p>
        <p>Occupation: {{ data.occupation }}</p>
        <p>Company: {{ data.company }}</p>
        <p>Hobbies: {{ data.hobbies?.join(", ") }}</p>
        <p>Website: {{ data.website }}</p>
    </div>
</template>
```

### Container Component - `DataContainer.vue`

The `DataContainer` encapsulates data fetching and passes it to its slot:

```html
<script setup>
    import { ref, onMounted } from "vue";

    const data = ref(null);

    onMounted(() => {
        // Simulating data fetching
        setTimeout(() => {
            data.value = {
                name: "John Doe",
                age: 30,
                email: "john.doe@example.com",
                address: "123 Main St",
                city: "Anytown",
                state: "CA",
                zip: "12345",
                phone: "555-1234",
                occupation: "Software Developer",
                company: "Tech Corp",
                hobbies: ["reading", "gaming", "hiking"],
                website: "https://johndoe.com",
            };
        }, 1000);
    });
</script>

<template>
    <slot :data="data"></slot>
</template>
```

### Using the Components Together

```html
<script setup>
    import DataContainer from "./components/DataContainer.vue";
    import Card from "./components/Card.vue";
    import Details from "./components/Details.vue";
</script>

<template>
    <DataContainer v-slot="{ data }">
        <Card :data="data" />
        <details :data="data" />
    </DataContainer>
</template>
```

## Enhancing the Pattern with Modern Approaches

### Using React Hooks

Encapsulate logic with a custom hook:

```js
import { useState, useEffect } from "react";

function useData() {
    const [data, setData] = useState(null);

    useEffect(() => {
        setTimeout(() => {
            setData({
                name: "John Doe",
                age: 30,
                email: "john.doe@example.com",
                address: "123 Main St",
                city: "Anytown",
                state: "CA",
                zip: "12345",
                phone: "555-1234",
                occupation: "Software Developer",
                company: "Tech Corp",
                hobbies: ["reading", "gaming", "hiking"],
                website: "https://johndoe.com",
            });
        }, 1000);
    }, []);

    return { data };
}

export default useData;
```

### Using the React Custom Hook in a Component

```html
import Card from "./components/Card";
import Details from "./components/Details";
import useData from "./components/useData";

function App() {
    const { data } = useData();

    return (
        <>
            <Card data={data} />
            <Details data={data} />
        </>
    );
}

export default App;
```

### Using Vue 3 Composables

Similarly, encapsulate logic with a composable function:

```js
import { ref, onMounted } from "vue";
const data = ref(null);

export default function useData() {
    onMounted(() => {
        setTimeout(() => {
            data.value = {
                name: "John Doe",
                age: 30,
                email: "john.doe@example.com",
                address: "123 Main St",
                city: "Anytown",
                state: "CA",
                zip: "12345",
                phone: "555-1234",
                occupation: "Software Developer",
                company: "Tech Corp",
                hobbies: ["reading", "gaming", "hiking"],
                website: "https://johndoe.com",
            };
        }, 1000);
    });

    return { data };
}
```

### Using the Vue Composable in a Component

```html
<script setup>
    import Card from "./components/Card.vue";
    import Details from "./components/Details.vue";
    import useData from "./components/useData";

    const { data } = useData();
</script>

<template>
    <Card :data="data" />
    <details :data="data" />
</template>
```

## **Conclusion**

The **Container/Presentational Pattern** remains a powerful approach for separating UI and logic in modern frontend development. While traditional container components are effective, **React Hooks** and **Vue 3 Composables** provide an even more elegant solution through modular, reusable functions. By moving logic into dedicated functions like `useData`, we gain several advantages:

- Better reusability across components
- Cleaner code with less boilerplate
- Improved testing and scalability

For modern frontend projects, embracing **React** **Hooks** or **Vue** **3 Composables** can significantly enhance your development workflow and align with contemporary component design principles.

The code for this is available in the following GitHub repository [here](https://github.com/Suv4o/the-container-presentational-pattern-with-react-and-vue).
