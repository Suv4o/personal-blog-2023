---
title: How to Bind Props in Vue Correctly
description: Master Vue props binding with this in-depth guide! Learn how to correctly pass strings, numbers, booleans, objects, arrays, and functions as props. Avoid common mistakes, understand prop types, and follow best practices to write clean, efficient, and error-free Vue components.
image: https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_1200,e_sharpen:100/v1740813459/blog/how-to-bind-props-in-vue-correctly/building_blocks_of_vue_3d_representation_of_1_wsoaxn
keywords:
    - Vue props binding
    - Vue component props
    - Vue props tutorial
    - Passing props in Vue
    - Vue 3 props
    - Vue props best practices
    - Vue dynamic props
    - Vue boolean props
    - Vue function props
    - Vue number props
    - Vue object props
    - Vue array props
    - Vue template literals props
    - Vue props validation
    - Vue defineProps
    - Vue props types
    - How to pass props in Vue 3
    - Best way to bind props in Vue
    - Common mistakes in Vue props binding
    - Difference between Vue 2 and Vue 3 props
    - How to pass functions as props in Vue
type: page
blog: post
published: 2nd March 2025
readTime: 6
author: Aleksandar Trpkovski
articleTags:
    - FrontEnd
    - Vue.js
    - JavaScript
---

# How to Bind Props in Vue Correctly

_{{$document.published}} • {{$document.readTime}} min read — by **[{{$document.author}}](/)**_

::tag-pills{:tags="articleTags"}
::

![Landing Image](https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_750,e_sharpen:100/v1740813459/blog/how-to-bind-props-in-vue-correctly/building_blocks_of_vue_3d_representation_of_1_wsoaxn)

Vue makes data binding in props simple and intuitive, but small syntax errors, especially when coming from other frameworks or languages, can lead to unexpected behaviour.

In this article, we'll break down the correct, unnecessary, and incorrect ways to bind props in Vue components when using them in the template.

## Understanding Vue Prop Types

Before diving into prop binding, it's essential to understand the different **prop types** that Vue supports:

- **String (`String`)**: Accepts text values.
- **Number (`Number`)**: Accepts numeric values.
- **Boolean (`Boolean`)**: Accepts `true` or `false`.
- **Object (`Object`)**: Accepts objects.
- **Array (`Array`)**: Accepts arrays.
- **Function (`Function`)**: Accepts functions.

## Simple Vue Bindings

Vue uses `v-bind` (or shorthand `:`) to bind data dynamically to props. However, different types of props require different approaches. Let’s explore them with practical examples.

### 1. Static Props

✅ **Correct:**

```html
<Component prop="Text" />
```

⚠️ **Unnecessary:**

```html
<Component :prop="'Text'" />
```

❌ **Incorrect:**

```html
<Component :prop="Text" />
```

**Explanation:** Static props should be written as plain strings without `:` since they don't need dynamic binding. The unnecessary syntax binds a static string dynamically, which isn’t needed. The incorrect syntax lacks quotes around `Text`, making Vue treat it as a variable instead of a string.

### 2. Boolean Props

✅ **Correct:**

```html
<Component :prop="true" />
```

❌ **Incorrect:**

```html
<Component prop="true" />
```

**Explanation:** Boolean props require `:` to be properly recognized as `true` or `false`. Without `:`, the value is treated as a string (`"true"`), which may not behave as expected.

> 💡 **Tip:** In Vue, simply adding a boolean prop without a value (e.g., `<Component prop />`) is equivalent to passing `true`.

### **3. Binding Numbers in Props**

✅ **Correct:**

```html
<Component :prop="42" />
```

❌ **Incorrect:**

```html
<Component prop="42" />
```

**Explanation:** Numbers should always be bound using `:` to ensure they are treated as actual numeric values. Without `:`, Vue treats them as strings, which can lead to unexpected type issues in the component.

### 4. Dynamic Props

✅ **Correct:**

```html
<Component :prop="item.name" />
```

⚠️ **Unnecessary:**

```html
<Component :prop="`${item.name}`" />
```

❌ **Incorrect:**

```html
<Component :prop="{{ item.name }}" /> <Component prop="item.name" />
```

**Explanation:** To pass a dynamic value, `:` is required to bind `item.name` properly. The unnecessary syntax wraps the value in a template literal, which is redundant. The incorrect examples either incorrectly use `{{ }}` (which is for templates, not bindings) or treat `"item.name"` as a static string instead of referencing the variable.

> 💡 **Tip:** The `:` shorthand tells Vue to evaluate an expression instead of treating it as a string.

### 5. Props with Template Strings

✅ **Correct:**

```html
<Component :prop="`Go to ${item.name}`" />
```

⚠️ **Unnecessary:**

```html
<Component :prop="'Go to ' + item.name" />
```

❌ **Incorrect:**

```html
<Component :prop="Go to ${item.name}" />
```

**Explanation:** The best approach is using template literals with backticks for readability. The unnecessary syntax still works but concatenates strings in a less readable way. The incorrect syntax lacks quotes, making Vue crash because it expects a dynamic variable.

> 💡 **Tip:** Template literals (``) improve readability, support multi-line strings, and eliminate the need for explicit `+` concatenation.

### **6. Passing Objects as Props**

✅ **Correct:**

```html
<Component :prop="{ name: 'Vue', version: 3 }" />
```

❌ **Incorrect:**

```html
<Component prop="{ name: 'Vue', version: 3 }" />
```

**Explanation:** Objects should always be bound dynamically using `:` to be correctly parsed as JavaScript objects.

### **7. Passing Arrays as Props**

✅ **Correct:**

```html
<Component :prop="[1, 2, 3]" />
```

❌ **Incorrect:**

```html
<Component prop="[1, 2, 3]" />
```

**Explanation:** Arrays must be bound using `:` to ensure they are treated as JavaScript arrays and not strings.

### **8. Passing Functions to Props**

✅ **Correct:**

```html
<Component :prop="handleClick" />
```

❌ **Incorrect:**

```html
<Component :prop="handleClick()" />
```

**Explanation:**

- The correct approach passes the function `handleClick` as a reference, allowing Vue to call it when needed.
- The incorrect approach **executes** `handleClick()` immediately when rendering, which is not the intended behaviour.

## **Cheat Sheet**

| Use Case                    | ✅ Correct Syntax                                   | ⚠️ Unnecessary Syntax                       | ❌ Incorrect Syntax                                                             |
| --------------------------- | --------------------------------------------------- | ------------------------------------------- | ------------------------------------------------------------------------------- |
| Static Props                | `<Component prop="Text"/>`                          | `<Component :prop="'Text'"/>`               | `<Component :prop="Text"/>`                                                     |
| Boolean Props               | `<Component prop />`                                | `<Component :prop="true"/>`                 | `<Component prop="true"/>`                                                      |
| Number Props                | `<Component :prop="42"/>`                           |                                             | `<Component prop="42"/>`                                                        |
| Dynamic Props               | `<Component :prop="item.name"/>`                    | `<Component :prop="`\``${item.name}`\``"/>` | `<Component :prop="{{ item.name }}"/>`<br> <br> `<Component prop="item.name"/>` |
| Props with Template Strings | `<Component :prop="`\``Go to ${item.name}`\``"/>`   | `<Component :prop="'Go to ' + item.name"/>` | `<Component :prop="Go to ${item.name}"/>`                                       |
| Passing Objects as Props    | `<Component :prop="{ name: 'Vue', version: 3 }" />` |                                             | `<Component prop="{ name: 'Vue', version: 3 }" />`                              |
| Passing Arrays as Props     | `<Component :prop="[1, 2, 3]" />`                   |                                             | `<Component prop="[1, 2, 3]" />`                                                |
| Passing Functions to Props  | `<Component :prop="handleClick" />`                 |                                             | `<Component :prop="handleClick()" />`                                           |
