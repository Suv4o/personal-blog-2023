---
title: The mysterious this keyword in Vueland
description: If you are new to Vue.JS you might have realised that "this" keyword is used everywhere. Some people might think that "this" keyword is part of the Vue.JS framework
image: https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_750,e_sharpen:100/v1618488085/blog/the_misterios_this_keyword_in_vueland
keywords:
    - Vue.js
    - Javascript
    - Frontend
    - development
    - web development
    - this keyword
type: article
published: 12th May 2021
readTime: 12
author: Aleksandar Trpkovski
articleTags:
    - Vue.js
    - JavaScript
    - FrontEnd
---

# The mysterious `this` keyword in Vueland

_{{$document.published}} • {{$document.readTime}} min read — by **[{{$document.author}}](/)**_

::tag-pills{:tags="articleTags"}
::

![blog hero image](https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_750,e_sharpen:100/v1618488085/blog/the_misterios_this_keyword_in_vueland)

If you are new to Vue.JS you might have realised that `this` keyword is used everywhere. Some people might think that `this` keyword is part of the Vue.JS framework itself. Others may wonder why `this` keyword behaves a little differently in JavaScript, as compared to other languages such as Java, C++, PHP, etc. If you've experience an error that reads `this is undefined`, you are not alone. In this article we will take a closer look at this common problem in Vue.JS, and how to solve it.

Before we dive into Vue.JS, we need to understand what exactly is `this` keyword.

`this` has been part of the JavaScript language for a very long time. To give you a time reference, Internet Explorer version 4.0 had fully supported `this` keyword. Inspite of it being with us for a very long period of time, people still struggle to understand it. So how do we define `this`? In most cases, the value of `this` is determined by how a function is called in JavaScript.

## The two types of functions in JavaScript

In Javascript we have two different types of functions, **regular functions** and **arrow functions**. They operate in almost the same manner, with one exception — they treat `this` variable differently.

### Example of a Regular function

```js
var sum = function (a, b) {
    return a + b;
};
```

### Example of an Arrow function

```js
var sum = (a, b) => a + b;
```

Even though both functions above do exactly the same job, a difference is noted when we start using `this` keyword in the function.

### Regular function

```js
var person = {
	firstName: “Aleks”,
	lastName: “Trpkovski”
 	thisInRegularFunction() {
 		console.log("My full name is " + this.firstName + “ “ + this.lastName);
 	}
};
person.thisInRegularFunction(); // Output: My full name is Aleks Trpkovski
```

### Arrow function

```js
var person = {
	firstName: “Aleks”,
	lastName: “Trpkovski”
	thisInArrowFunction:() => {
		console.log("My full name is " + this.firstName + “ “ + this.lastName);
 	}
};
person.thisInArrowFunction; // Output: My full name is
```

From the examples above, this demonstrates the point of arrow functions not having their own `this`. In order to fully understand the behaviour of `this` keyword in both regular and arrow functions, please review the following reasoning.

## `this` in Regular functions

`this` in regular JavaScript functions refers to the object that the function belongs to. In other words the value of `this` depends on how the function is called, not where the function was declared. Even though the function was declared in a specific file or a particular object, `this` changes its value based on the owner to the function call. It is important to remember the same function can have different owners in different scenarios.

The value of `this` in regular JavaScript function is determined by 4 rules.

## 1. Default Binding

Default Binding happens when a function is invoked without any of these other 3 rules. In this rule `this` points to the global object. This means that if you are in the browser, `this` will be the window object. Default binding is applied for standalone functions. For example, any functions that are called without a “.” before it.

```js
obj.foo(); // Not Standalone function
foo(); // Standalone function, Default Binding applies
```

### Examples for Default Binding

```js
function foo() {
	console.log(“My name is “ + this.name);
}

var name = “Aleks”;

foo(); // Output: My name is Aleks.
```

## 2. Implicit Binding

Implicit Binding happens when invoked with a ”.” before it. For instance, `obj.foo()`. In this rule, whatever is to the left of the dot becomes the context for `this` in the function.

```js
obj.foo(); // the value of `this` in foo is obj
obj1.obj2.foo(); // the value of `this` in foo is obj2
obj1.obj2.obj3.foo(); // the value of `this` in foo is obj3
```

### Examples for Implicit Binding

```js
function foo() {
	console.log(“My name is “ + this.name);
}

var obj = {
	name: “Aleks”,
	foo: foo
};

obj.foo(); // Output: My name is Aleks.
```

One of the common frustrations you would face when **Implicitly Binding** a function, is that in certain circumstances, the function loses `this` binding. This means that it will usually fall back to the **Default Binding**. This often happens with nested functions or when creating a reference to the function to a new variable.

## 2.1. Implicit Binding with Nested Functions

When a function is nested inside a method of an object, `this` variable depends on the inner function invocation.

```js
var obj = {
 	name: “Aleks”,
  	outer: function() {
    		function inner() {
       			console.log(“My name is “ + this.name);
    		}
    		inner(); // Default Binding applies
  	},
};

var name = “Nicole”;

obj.outer(); // Output: My name is Nicole

```

In the example above, although the outer function was called using implicit binding, the inner function was called using default binding. Thus, `this` points to the global object.

## 2.2. Implicit Binding with a reference to the function

```js
function foo() {
	console.log(“My name is “ + this.name);
}

var obj = {
	name: “Aleks”,
	foo: foo
};

var name: “Nicole”;

var bar = obj.foo();

bar(); // Output: My name is Nicole.
```

Although bar appears to be reference to `obj.foo()`, `bar()` directly refers to `foo()`. Hence, default binding applies.

## 3. Explicit Binding

Explicit binding of `this` happens when one of the three `.call()`, .`apply()`, or .`bind()` are used in a function. In that way we can force a function to use a certain object as `this`. For instance, when calling `foo.call(obj)`, the value of `this` in the function `foo` becomes `obj`. **Call**, **apply** and **bind** do the same thing, with some little differences.

-   `.call()`: Pass in the required object (value of `this`) as the first parameter, along with additional parameters that are separated by comma. For example `foo.call(obj, param1, param2, …)`.

-   `.apply`: Is almost the same as `.call()` with only difference in the way the actual parameters are passed. Unlikely **Call**, **Apply** accepts parameters as an array. For example `foo.apply(obj, [param1, param2, …])`.

```js
function foo(age, city) {
	console.log(“My full name is “ + this.firstName + “ ” + this.lastName + “ ” + age + “ years old, living in ” + city);
 }

var obj = {
	firstName: “Aleks”,
	lastName: “Trpkovski”
}

var age= 32, city = “Melbourne”;

foo.call(obj, age, city); // Output: My full name is Aleks Trpkovski 32 years old, living in Melbourne
foo.apply(obj, [age, city]); // Output: My full name is Aleks Trpkovski 32 years old, living in Melbourne
```

-   `.bind()`: Is a little bit different than **Call** and **Apply**. When call a function with **Bind**, returns new function of the same name.

```js
function foo(age, city) {
	console.log(“My full name is “ + this.firstName + “ ” + this.lastName + “ ” + age + “ years old, living in ” + city);
 }

var obj = {
	firstName: “Aleks”,
	lastName: “Trpkovski”
}

var age= 32, city = “Melbourne”;

var bar = foo.bind(obj, age, city)
bar(); // Output: My full name is Aleks Trpkovski 32 years old, living in Melbourne
```

## 4. `new` Binding

When a function is invoked using the `new` operator, also known as a constructor call, we create a brand new empty object and set that new object as `this` inside the function.

```js
function foo(name) {
	this.name = “My name is “ + name;
}

var bar = new foo(“Aleks”);
console.log(bar.name); // Output: My name is Aleks
```

## Arrow functions

ES6 introduced a special kind of function known as arrow functions. Unlike the regular functions where the value of `this` is determined by the 4 rules mentioned above, the arrow functions use `this` from the outer function or the global scope in which it is declared. For example, if the outer function is an arrow function, then it checks for the next outer function and repeats till the global scope.

```js
function foo(){
	var bar = () => {
      		console.log(this);
    	};
    bar();
}

var obj1 = {
	name: “Aleks”,
  	foo: foo
};

var obj2 = {
  	name: “”Nicole
};

foo(); // Output: Window {}
obj1.foo(); // {name: “Aleks”, foo: ƒ}
foo.call(obj2); // {name: “Nicole”}
```

As we can see from the example above, each time `bar` is called, the value of `this` is taken from the outer function. In this case, `foo`.

```js
var foo = () => {
    console.log(this);
};

var obj1 = {
    foo: foo,
    bar: () => {
        console.log(this);
    },
};

var obj2 = {};

foo(); // Output: Window {}
obj1.foo(); // Output: Window {}
obj1.bar(); // Output: Window {}
foo.call(obj2); // Output: Window {}
var obj3 = new foo(); // Output: Window {}
```

As we can see in the last example above, none of the 4 binding rules has any direct impact on arrow functions.

Now when `this` make sense, it brings us to the next section — how all this applies to Vue.JS.

## Understanding `this` keyword in Vue.JS

In this blog post, we won't focus on the fundamentals of Vue.JS framework. That would be going off track from the main purpose of this post. We will instead look at how `this` keyword affects the function declaration in the method property.

As seen previously, we have two types of functions in JavaScript. So technically we can use either regular or arrow to declare a function in Vue.JS.

```js
methods: {
  	regularFunction() {
    		console.log(this); // Output: Vue componet
  	}
}
```

```js
methods: {
    arrowFunction: () => {
        console.log(this); // Output: this is undefined
    };
}
```

Even though both function declarations are correct, there is a difference in how they treat `this` variable.

In a regular function, `this` refers to the owner of the function. In our case, `this` refers to the Vue component. Hence, we can safely use `this` to get any of the data properties, computed properties or methods of the Vue component.

On the other hand, in an arrow function, `this` does not refer to the Vue component. As explained previously, the arrow functions use `this` from the outer function or the global scope in which it is declared. In our example above that is the global scope and the reasoning behind of getting `this is undefined` printed in the console.

It is recommended to use a regular function with Vue, especially when creating methods, computed properties, watched properties. But in certain scenarios, arrow functions come in very handy as well. We will have a look at various issues and how to solve them with either regular or arrow functions in the next few examples below.

Consider this code:

```js
data() {
	return {
      		name: "Aleks",
    	}
},
methods: {
    	foo() {
		console.log("My name is: " + this.name); // Output: My name is Aleks.
										         // `this` on this line, refers to the Vue Component.
										         // we can use `this` to get any of the data properties of this Vue Component.

      		var bar = function() {
        		console.log("My name is: " + this.name); // Output: this is undefined
      		};									         // this here refers to the Window object.
											             // the Default Binding applies
      		setTimeout(bar(), 100);
    	},
}
```

Where most likely we will get into trouble using `this`, is when we declare another function inside the current function, as shown in the previous example. We have explained this scenario in the **Implicit Binding** section under **Implicit Binding with Nested Functions**.

This is a common problem in Vue.JS, especially when dealing with callbacks. `this` in the `bar` refers to the global object (the Window). As explained in the previous section in JavaScript, when you declare a new regular function, that function has it's own `this` variable, which is different from the outer function, in our case, `foo` in which it is declared. The confusing part in the example above is the **Default Binding** in the second function.

Lets refactor the provided built-in function `setTimeout()` in JavaScript.

```js
function SetTimeout(bar(), delay) {
	// wait (somehow) for ‘delay’ milliseconds
	bar(); // Standalone function, Default Binding applies
}
```

### How can we fix `this`

There are several ways to deal with `this` inside a function in Vue.JS.

One solution would be to use **Explicit Binding** with one of the three `.call()`, .`apply()`, or .`bind()` methods on the function call.

```js
setTimeout(bar.call(this), 100); // Output: My name is Aleks.
setTimeout(bar.apply(this), 100); // Output: My name is Aleks.
setTimeout(bar.bind(this), 100); // Output: My name is Aleks.
```

The other solution is most commonly used — by using a closure.

```js
data() {
	return {
      		name: "Aleks",
    	}
},
methods: {
    	foo() {
		var self = this; // In the variable self we save a reference to the this

		console.log("My name is: " + this.name); // Output: My name is Aleks.
										         // `this` on this line, refers to the Vue Component.

      		var bar = function() {
        		console.log("My name is: " + self.name);  // Output: My name is Aleks.
      		};									          // this here refers to the Window.
											              // we can use the reference we declared self which is refering to the Vue Component.
      		setTimeout(bar(), 100);
    	},
}
```

And the last, and by far most common solution these days is to use an arrow function.

```js
data() {
	return {
      		name: "Aleks",
    	}
},
methods: {
    	foo() {
		console.log("My name is: " + this.name); // Output: My name is Aleks.
										         // `this` on this line, refers to the Vue Component.

      		var bar = () => {
        		console.log("My name is: " + this.name); // Output: My name is Aleks.
      		};									         // this here also refers to the Vue Component.
											             // the value of `this` is taken from the outer function, in this case ‘foo’.
      		setTimeout(bar(), 100);
    	},
}
```

I hope this make sense!

## Conclusion

1. The value of `this` is determined by how a function is called in JavaScript.
2. In Javascript, we have two different types of functions, **regular functions** and **arrow functions**. They operate in almost the same manner, with one exception where they treat `this` variable differently.
3. The value of `this` in regular JavaScript function is determined by 4 rules: **Default Binding**, **Implicit Binding**, **Explicit Binding** and **`new` Binding**.
4. Unlike the regular functions where the value of `this` is determined by the 4 rules, the arrow functions uses `this` from the outer function, or the global scope in which it is declared.
5. The most challenging part when working with `this` in Vue.JS, is when we declare a function inside the current function. There are several ways to fix that.
