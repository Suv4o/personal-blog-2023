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

# Understanding JavaScript Reactivity with Proxy and TypeScript

_{{$document.published}} • {{$document.readTime}} min read — by **[{{$document.author}}](/)**_

::tag-pills{:tags="articleTags"}
::

![Landing Image](https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_750,e_sharpen:100/v1736332534/blog/the-container-presentational-pattern-with-react-and-vue/the-container-presentational-pattern-with-react-and-vue_tx5c9t)

Reactivity is a core concept in modern JavaScript frameworks like Vue.js, where UI automatically updates when the underlying data changes. But have you ever wondered how to implement a similar reactivity system yourself? In this blog post, we’ll explore how you can use JavaScript's `Proxy` to monitor and react to data changes. By the end, we’ll create a simple reactive system with two-way HTML bindings using TypeScript.

## Step 1: Monitoring Changes with JavaScript Proxy

The `Proxy` object in JavaScript allows you to intercept and customise operations performed on an object, such as reading or setting a property. Let’s start with a simple example:

```javascript
// Define a target object
let target = { value: 0 };

// Create a Proxy handler to track changes
const handler = {
    set(obj, prop, value) {
        console.log(`Property "${prop}" changed from ${obj[prop]} to ${value}`);
        obj[prop] = value; // Update the value
        return true; // Indicate success
    },
};

// Create a proxy for the target object
const proxy = new Proxy(target, handler);

// Monitor changes
proxy.value = 42; // Logs: Property "value" changed from 0 to 42
proxy.value = 100; // Logs: Property "value" changed from 42 to 100
```

Here, every time the `value` property changes, the `set` trap is triggered, and we log the change. This is the foundation for building a reactive system.

## Step 2: Creating a Reusable `watch` Function

Next, let’s create a reusable function called `watch`. This function will monitor changes to a specific property and execute a callback whenever the property changes.

```javascript
function watch(target, property, callback) {
    const handler = {
        set(obj, prop, value) {
            if (prop === property) {
                callback(value, obj[prop]); // Call the callback
            }
            obj[prop] = value; // Update the value
            return true;
        },
    };

    return new Proxy(target, handler);
}

// Usage example
let data = { value: 0 };
const watchedData = watch(data, "value", (newValue, oldValue) => {
    console.log(`Value changed from ${oldValue} to ${newValue}`);
});

watchedData.value = 42; // Logs: Value changed from 0 to 42
watchedData.value = 100; // Logs: Value changed from 42 to 100
```

This abstraction makes it easy to monitor changes for any property in any object.

## Step 3: Simplifying Reactivity with `ref`

Inspired by Vue.js, we can simplify our system by wrapping a value in a `ref`. A `ref` is an object with a single `value` property that is reactive. Here’s how it looks in JavaScript:

```javascript
function ref(initialValue, onChange) {
    const target = { value: initialValue };

    const handler = {
        set(obj, prop, newValue) {
            if (prop === "value") {
                onChange?.(newValue, obj[prop]); // Trigger callback
            }
            obj[prop] = newValue; // Update the value
            return true;
        },
    };

    return new Proxy(target, handler);
}

// Example usage
const name = ref("Alex", (newValue, oldValue) => {
    console.log(`Name changed from ${oldValue} to ${newValue}`);
});

console.log(name.value); // Alex
name.value = "John"; // Logs: Name changed from Alex to John
```

This implementation is simple and reusable, but we can make it even better by adding type safety with TypeScript.

## Step 4: Adding TypeScript for Type Safety

With TypeScript, we can make the `ref` function type-safe. This ensures that the `value` property always has the correct type and the callback receives properly typed arguments.

```typescript
type RefCallback<T> = (newValue: T, oldValue: T) => void;

function ref<T>(initialValue: T, onChange?: RefCallback<T>) {
    const target = { value: initialValue };

    const handler: ProxyHandler<{ value: T }> = {
        set(obj, prop, newValue) {
            if (prop === "value" && obj.value !== newValue) {
                onChange?.(newValue as T, obj.value); // Trigger callback
            }
            obj[prop as keyof typeof obj] = newValue;
            return true;
        },
    };

    return new Proxy(target, handler);
}

// Usage with TypeScript
const age = ref(25, (newValue, oldValue) => {
    console.log(`Age changed from ${oldValue} to ${newValue}`);
});

age.value = 30; // Logs: Age changed from 25 to 30
```

With TypeScript, you get type safety, better IDE support, and fewer runtime errors.

## Step 5: Building a Reactive HTML System

Finally, let’s create a system where changes to a `ref` update the DOM reactively. We’ll use our `ref` implementation from the previous step.

```html
<!doctype html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Reactivity with Proxy and TypeScript</title>
    </head>
    <body>
        <div>
            <p id="text"></p>
            <input id="input" type="text" placeholder="Enter text..." />
        </div>
        <script>
            function ref(initialValue, onChange) {
                const target = { value: initialValue };

                const handler = {
                    set(obj, prop, newValue) {
                        if (prop === "value" && obj.value !== newValue) {
                            onChange?.(newValue, obj.value); // Trigger callback
                        }
                        obj[prop] = newValue;
                        return true;
                    },
                };

                return new Proxy(target, handler);
            }

            document.body.innerHTML = `
          <div>
            <p id="text"></p>
            <input id="input" type="text" placeholder="Enter text..." />
          </div>
        `;

            const textElement = document.getElementById("text");
            const inputElement = document.getElementById("input");

            // Create a reactive ref
            const name = ref("Alex", (newValue) => {
                textElement.textContent = `Hello, ${newValue}!`; // Update the DOM reactively
            });

            // Initialize the DOM
            textElement.textContent = `Hello, ${name.value}!`;

            // Listen for input changes
            inputElement.addEventListener("input", (event) => {
                const target = event.target;
                name.value = target.value; // Trigger reactivity
            });
        </script>
    </body>
</html>
```

### How It Works:

1. **Reactive Updates:** When `name.value` changes, the callback updates the DOM (`<p>` element).
2. **Two-Way Binding:** Changes in the input field update the `name.value`, and the DOM reacts accordingly.
3. **Reactivity Simplified:** This mimics Vue.js's two-way data binding system with minimal code.

## Conclusion

Using JavaScript's `Proxy`, we’ve built a simple yet powerful reactivity system. We started with basic change tracking, moved to a reusable `watch` function, simplified it with `ref`, added type safety with TypeScript, and finally created a reactive HTML system.

This demonstrates how modern frameworks implement reactivity under the hood, and you can now experiment with your own lightweight reactive systems.

The code for this is available in the following GitHub repository [here](https://github.com/Suv4o/understanding-javascript-reactivity-with-proxy-and-typescript?tab=readme-ov-file).
