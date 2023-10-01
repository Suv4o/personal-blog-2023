---
title: Watch JavaScript Variables for Change
description: We all know that in JavaScript there is no event that fires when a value of a variable changes. But by defining getters and setters in the object this is now possible. First, define a new property on an object with "Object.defineProperty" method. As a first argument, we pass the object on which to define the property. If the object is defined in the global scope, "this" will refer to the window object. In the second argument, we will define the name of the property. In our case, we define a property with name "name". The third argument is the descriptor for the property being defined.
image: https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_750,e_sharpen:100/v1630971440/blog/watch-javascript-variables-for-change
type: article
published: 7th Sep 2021
readTime: 6
author: Aleksandar Trpkovski
articleTags:
    - JavaScript
    - FrontEnd
    - Node.js
---

# Watch JavaScript Variables for Change

_{{$document.published}} • {{$document.readTime}} min read — by **[{{$document.author}}](/)**_

::tag-pills{:tags="articleTags"}
::

![blog hero image](https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_750,e_sharpen:100/v1630971440/blog/watch-javascript-variables-for-change)

We all know that in JavaScript there is no event that fires when a value of a variable changes. But by defining [getters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_Objects#defining_getters_and_setters) and [setters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_Objects#defining_getters_and_setters) in the object this is now possible.

First, define a new property on an object with `Object.defineProperty` [method](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty). As a first argument, we pass the object on which to define the property. If the object is defined in the global scope, `this` will refer to the window object. In the second argument, we will define the name of the property. In our case, we define a property with name `name`. The third argument is the descriptor for the property being defined.

```js
Object.defineProperty(this, "name", {
    get() {},
    set(value) {},
});
```

In the descriptor we write the logic in the getter and setting methods. In the setter if the received value is the same as the previous set value, we `return`. Otherwise, we store the previous value in a variable called `oldValue` and we assign the new value in the variable `_name`. We next return the `_name` in the getter.

```js
Object.defineProperty(this, "name", {
    get() {
        return this._name;
    },
    set(value) {
        if (value === this.name) {
            return;
        }
        const oldValue = this.name;
        this._name = value;
        console.log(`Changed value from ${oldValue} to ${value}`);
    },
});

this.name = "Aleks";
this.name = "Nicole";
this.name = "Nicole";
console.log(this.name);
```

The output of this will be:

```plain
Changed value from undefined to Aleks
Changed value from Aleks to Nicole
Nicole
```

As seen above, we set the name to "Nicole" two times in the row but it was registered only one change of a value.

## Create a reusable function

The example above is a good starting point. However, we will need to repeat the same procedure over and over again, each time we define a watcher to a new variable. To avoid that hassle, we will create a reusable function:

```js
const createWatchedProperty = (propertyName) => {
    Object.defineProperty(this, propertyName, {
        get() {
            return this[`_${propertyName}`];
        },
        set(value) {
            if (value === this[propertyName]) {
                return;
            }
            const oldValue = this[propertyName];
            this[`_${propertyName}`] = value;
            console.log(`Changed value from ${oldValue} to ${value}`);
        },
    });
};

createWatchedProperty("name");
this.name = "Aleks";
this.name = "Nicole";
this.name = "Nicole";
console.log(this.name);
```

Now, we can use `createWatchedProperty` function to create a watched property by passing the name of the variable.

At the moment we only output the old and the new variables in the console. It would be nice if can define a custom function where we can write a logic on value change. Let's see how we can do that:

```js
const createWatchedProperty = (propertyName) => {
    Object.defineProperty(this, propertyName, {
        get() {
            return this[`_${propertyName}`];
        },
        set(value) {
            if (value === this[propertyName]) {
                return;
            }
            const oldValue = this[propertyName];
            this[`_${propertyName}`] = value;
            this["watch" + propertyName[0].toUpperCase() + propertyName.slice(1)](
                (newVal = value),
                (oldVal = oldValue)
            );
        },
    });
};

this.watchName = (newValue, oldValue) => {
    console.log("New: ", newValue, "Old: ", oldValue);
};

createWatchedProperty("name");
this.name = "Aleks";
this.name = "Nicole";
this.name = "Nicole";
console.log(this.name);
```

The output of this will be:

```plain
New:  Aleks Old:  undefined
New:  Nicole Old:  Aleks
Nicole
```

The function where we define the logic of the value change in the example above name starts with "watch" + the name of the variable in camel case. In our example, this will be `watchName`. The function takes two parameters `newValue` and `oldValue`. See example above.

## Problem with the current solution

The code above works perfectly fine but only when is defined in the global scope. But what if we want to defined it in an object's method?

Let's see the following example:

```js
const createWatchedProperty = (propertyName) => {
    Object.defineProperty(this, propertyName, {
        get() {
            return this[`_${propertyName}`];
        },
        set(value) {
            if (value === this[propertyName]) {
                return;
            }
            const oldValue = this[propertyName];
            this[`_${propertyName}`] = value;
            this["watch" + propertyName[0].toUpperCase() + propertyName.slice(1)](
                (newVal = value),
                (oldVal = oldValue)
            );
        },
    });
};

const someObject = {
    someFunction: function () {
        this.watchName = (newValue, oldValue) => {
            console.log("New: ", newValue, "Old: ", oldValue);
        };

        createWatchedProperty("name");
        this.name = "Aleks";
        this.name = "Nicole";
        this.name = "Nicole";
        console.log(this.name);
    },
};

someObject.someFunction();
```

The output of this will be:

```plain
Nicole
```

When we use `createWatchedProperty` function inside the object's method, `this` doesn't refer to the global object (window). Instead, `this` refers to its internal function. To solve this issue, we need to make some changes in our `createWatchedProperty` function where we can pass the object as a parameter to specify where we would like the property to be created.

Let's see the code bellow:

```js
const createWatchedProperty = (propertyName, obj) => {
    Object.defineProperty(obj, propertyName, {
        get() {
            return obj[`_${propertyName}`];
        },
        set(value) {
            if (value === obj[propertyName]) {
                return;
            }
            const oldValue = obj[propertyName];
            obj[`_${propertyName}`] = value;
            obj["watch" + propertyName[0].toUpperCase() + propertyName.slice(1)]((newVal = value), (oldVal = oldValue));
        },
    });
};

const someObject = {
    someFunction: function () {
        this.watchName = (newValue, oldValue) => {
            console.log("New: ", newValue, "Old: ", oldValue);
        };

        createWatchedProperty("name", this);
        this.name = "Aleks";
        this.name = "Nicole";
        this.name = "Nicole";
        console.log(this.name);
    },
};

someObject.someFunction();
```

## Create subscribe and unsubscribe functions

Lastly, we can go further by creating **subscribe** and **unsubscribe** functions. In the descriptor we should set `configurable: true`. The `Object.defineProperty()` defaults to non-configurable properties and we should pass it `true` to allow it. This is important because we are unable to redefine the property when we unsubscribe from our watcher.

```js
const subscribe = (propertyName, obj) => {
    Object.defineProperty(obj, propertyName, {
        configurable: true,
        get() {
            return obj[`_${propertyName}`];
        },
        set(value) {
            if (value === obj[propertyName]) {
                return;
            }
            const oldValue = obj[propertyName];
            obj[`_${propertyName}`] = value;
            obj["watch" + propertyName[0].toUpperCase() + propertyName.slice(1)]((newVal = value), (oldVal = oldValue));
        },
    });
};

const unsubscribe = (propertyName, obj) => {
    Object.defineProperty(obj, propertyName, {
        get() {},
        set() {},
    });
};

this.watchName = (newValue, oldValue) => {
    console.log("New: ", newValue, "Old: ", oldValue);
};

subscribe("name", this);
this.name = "Aleks";
this.name = "Nicole";
this.name = "Nicole";
this.name = "April";
unsubscribe("name", this);
this.name = "Tom";
this.name = "Mark";
this.name = "Bob";
subscribe("name", this);
this.name = "Chris";
```

The output of this will be:

```js
New:  Aleks Old:  undefined
New:  Nicole Old:  Aleks
New:  April Old:  Nicole
New:  Chris Old:  April
```

## Conclusion

1.  In JavaScript there isn't an event that fires when a value of a variable changes. But that is completely possible to be implemented by defining getters and setters in the object.
2.  We use `Object.defineProperty` method to define a variable that we can watch for changes.
3.  It is a good practice to create a reusable function for creating a watched property, where we can pass an object argument in order for the variable to be defined in that particular object.
4.  Creating **subscribe** and **unsubscribe** functions allow us to add and remove a watcher to the variable. That way, we can stop watching a variable change when we need to. Remember to add set `configurable: true` in the descriptor. This will allow us to redefined the property when we unsubscribe.

All examples above can be found in the following github repository [link](https://github.com/Suv4o/watch-javascript-variables).

---
