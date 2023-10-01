---
title: Including local Node.js modules in Firebase Cloud Functions
description: Modules have become a major part of the JavaScript ecosystem. They allow us to split our JavaScript programs up into separate smaller parts, called modules, that can be imported when needed. In this article, we will have a look at how we can include local modules in our Node.js app, and then see how that differentiates from including them in Firebase Cloud Functions. Before we continue, do note that this is not an introduction to Firebase. A basic understanding of Firebase and JavaScript is required before reading on about the examples that I'm about to explain.
image: https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_750,e_sharpen:100/v1631602643/blog/including-local-nodejs-modules-in-firebase-cloud-functions/including-local-modules
type: article
published: 17th Sep 2021
readTime: 8
author: Aleksandar Trpkovski
articleTags:
    - JavaScript
    - Firebase
    - Node.js
---

# Including local Node.js modules in Firebase Cloud Functions

_{{$document.published}} • {{$document.readTime}} min read — by **[{{$document.author}}](/)**_

::tag-pills{:tags="articleTags"}
::

![alt text](https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_750,e_sharpen:100/v1631602643/blog/including-local-nodejs-modules-in-firebase-cloud-functions/including-local-modules)

Modules have become a major part of the JavaScript ecosystem. They allow us to split our JavaScript programs up into separate smaller parts, called modules, that can be imported when needed.

In this article, we will have a look at how we can include local modules in our Node.js app, and then see how that differentiates from including them in Firebase Cloud Functions. Before we continue, do note that this is not an introduction to Firebase. A basic understanding of Firebase and JavaScript is required before reading on about the examples that I'm about to explain.

## Build simple app in Node.js

Before diving into Node.js modules, let's build a simple Node.js app. We are going to create a function that takes a string and then returns a capitalised first letter of each word in that string. Let's see how we can do that.

```js
function capitalise(input) {
    const words = input.split(" ");
    const CapitalisedWords = [];
    words.forEach((word) => {
        CapitalisedWords.push(word[0].toUpperCase() + word.slice(1, word.length));
    });
    return CapitalisedWords.join(" ");
}

console.log(capitalise("javascript engines were originally used only in web browsers"));
```

The output of this will be:

```bash
Javascript Engines Were Originally Used Only In Web Browsers
```

The example above works perfectly fine, but it would be nicer if we split it into smaller peaces. Let's carry this out.

## Create a module from the `capitalise` function

To organise our code better, we can define a separate module with the `capitalise` function, and then include this in our main app. Our directory structure should look like this:

```plain
root/
  index.js
  capitalise.js
```

In the `capitalise.js` we define `capitalise` function as follows:

```js
module.exports.capitalise = function (input) {
    const words = input.split(" ");
    const CapitalisedWords = [];
    words.forEach((word) => {
        CapitalisedWords.push(word[0].toUpperCase() + word.slice(1, word.length));
    });
    return CapitalisedWords.join(" ");
};
```

And then in `index.js` we include the capitalise module and call that function. We use the [CommonJS](https://requirejs.org/docs/commonjs.html) syntax to export and import modules in our Node.js app. In CommonJS `module.exports` method is used for exporting modules, and `require()` method for importing.

> Please note that with the release of Node version 15.3.0 ES modules can also be used.

```js
const { capitalise } = require("./capitalise");

console.log(capitalise("javascript engines were originally used only in web browsers"));
```

We've achieved the exact same outcome now by using modules. As we can see, modules help to better organise and structure our codebase.

## Create the same app in Firebase Cloud Functions

Before we start working with Firebase, we need to create a Firebase project in the [Firebase console](https://console.firebase.google.com/?authuser=0). In order to be able to use Firebase Cloud Functions, we need to upgrade to the Blaze plan (pay as you go). Firebase has a moderate free tier for hobby users. If you'ld like to check the prices for their services visit the following [link](https://firebase.google.com/pricing).

The next step is to install Firebase command line tools using npm. We can install the firebase tools with the following command `npm install -g firebase-tools`.

Once firebase tools have been installed, we need to login to our firebase. We can do so with the following command in the terminal `firebase login` and then visit the URL that firebase CLI will output in the command line.

In our root directory, we will now initialise our firebase functions. We initialise our functions with `firebase init`. Firebase CLI will give us options to select. We need to chose **_Functions: Configure a Cloud Functions directory and its files._**

![alt text](https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_750,e_sharpen:100/v1631602642/blog/including-local-nodejs-modules-in-firebase-cloud-functions/image-1_nxs6lz)

We next choose the project that we've created earlier in the firebase console:

![alt text](https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_750,e_sharpen:100/v1631602642/blog/including-local-nodejs-modules-in-firebase-cloud-functions/image-2_bm8o63)

Select JavaScript as a language, **No** to ESLint, and lastly choose to install dependencies with npm.

![alt text](https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_750,e_sharpen:100/v1631602643/blog/including-local-nodejs-modules-in-firebase-cloud-functions/image-3_rbawf6)

Now we have **functions** folder with **index.js** file. Our directory structure should look like this:

```plain
root/
  functions/
	  index.js
		package.json
```

The way we include local Node.js modules in our cloud functions is a little different than our earlier Node.js app. If we follow the earlier steps, we will end up with an error when we try to deploy Cloud Functions to Firebase. In order to include local Node.js modules in cloud functions, we need to to do the following.

In the **index.js** we will now declare our `onRequest` cloud function and then include our capitalise module. You can clearly see that we call `capitalise` instead of `./capitalise` in the `require()` method.

```js
const functions = require("firebase-functions");
const { capitalise } = require("capitalise");

exports.capitaliseWords = functions.https.onRequest((req, res) => {
    const text = capitalise(req.body.text);
    res.status(200).send(text);
});
```

Next, we create a new directory inside our **function/** folder called **capitalise/,** with a sub-folder file called **index.js**. In the **functions/capitalise/index.js** file we declare our `capitalise` functions and export as a module:

```js
module.exports.capitalise = function (input) {
    const words = input.split(" ");
    const CapitalisedWords = [];
    words.forEach((word) => {
        CapitalisedWords.push(word[0].toUpperCase() + word.slice(1, word.length));
    });
    return CapitalisedWords.join(" ");
};
```

We will also need to run **npm init -y** inside **functions/capitalise/** directory. That way, we can initialise a **package.json** file. Our final directory structure should look like this:

```plain
root/
  functions/
	  index.js
		package.json
		capitalise/
			index.js
			package.json
```

Lastly, we need to declare our module in **functions/package.json** using the file: prefix. In the following example, capitalise refers to our module name and **"file:./capitalise/"** is the directory containing our module:

```json
"dependencies": {
        "capitalise": "file:./capitalise/"
    },
```

To deploy our cloud functions, we use the following command in our terminal `firebase deploy --only functions`.

## Conclusion

1. Modules have become a major part of the JavaScript ecosystem. They allow us to split our JavaScript programs up into separate smaller parts, so called modules that can be imported when needed.
2. In Node.js, we organise our code better by defining separate local modules and then include them in our app.
3. There are differences on how we include local modules in Node.js app versus Firebase Cloud functions.
4. In order to use local modules in Firebase Cloud Functions, we need to declare our module in **functions/package.json** using the file: prefix.

All examples above can be found in the following github repository [link](https://github.com/Suv4o/local-nodejs-modules-in-firebase-cloud-functions).

---
