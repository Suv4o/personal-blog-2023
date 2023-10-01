---
title: Firebase Auth token verification with a custom backend server
description: Firebase as a platform that offers a wide range of services to developers to build, improve, and grow their apps with little or almost no effort. This includes services like authentication, databases,  analytics, file storage, push messaging and more. When it comes to user authentication, Firebase provides an Authentication service that allows for codes to be written in order for users to be logged into an app right from the client side, and limit user access to resources in other Firebase products. This is fairly simple to use without the need to implement any backend solution. Firebase also provides an Admin SDK that allows developers to build a custom backend if required.
image: https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_750,e_sharpen:100/v1626001455/blog/firebase-authentication-token-verification-with-a-custom-backend-server
type: article
published: 13th Jul 2021
readTime: 9
author: Aleksandar Trpkovski
articleTags:
    - Firebase
    - JavaScript
    - Node.js
---

# Firebase Auth token verification with a custom backend server

_{{$document.published}} • {{$document.readTime}} min read — by **[{{$document.author}}](/)**_

::tag-pills{:tags="articleTags"}
::

![blog hero image](https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_750,e_sharpen:100/v1626001455/blog/firebase-authentication-token-verification-with-a-custom-backend-server)

Firebase as a platform that offers a wide range of services to developers to build, improve, and grow their apps with little or almost no effort. This includes services like authentication, databases, analytics, file storage, push messaging and more. When it comes to user authentication, Firebase provides an Authentication service that allows for codes to be written in order for users to be logged into an app right from the client side, and limit user access to resources in other Firebase products. This is fairly simple to use without the need to implement any backend solution. Firebase also provides an Admin SDK that allows developers to build a custom backend if required.

In this article we will have a look at few examples on how we can use token ID provided by Firebase client side to verify our user on a custom backend using Node.js. Before we continue, do note that this is not an introduction to Firebase. A basic understanding of Firebase and JavaScript is required before reading on about the examples that I'm about to explain.

## Connect your app to Firebase

Before we start working with Firebase we need to create a Firebase project in the [Firebase console](https://console.firebase.google.com/?authuser=0). We will then add and initialise the Firebase SDK to our web app. For a detailed explanation on how to set up Firebase to your JavaScript project, follow the instructions on this [link](https://firebase.google.com/docs/web/setup).

## User authenticate from the client side

The example below shows user authentication using email and password on the Firebase client side SDK. As we can see it is an easy and straight forward solution without the need of backend server.

```js
firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
        console.log(userCredential.user); // Signed in
    })
    .catch((error) => {
        console.log(error.code, error.message);
    });
```

What happens if we would like to add on verifications for our signed in user on the custom backend server?

## Verify user on the backend server

To be able to interact with Firebase from a backend server we need to use the Firebase Admin SDK. For a detailed explanation on how to set up Firebase on the backend server, follow the instructions on this [link](https://firebase.google.com/docs/admin/setup).

### Verify ID Tokens

If the user is signed in from the client app, how would we identify that user on the server. To do so, in a secure manner, we will first send the user ID token to our server from the client via HTTPS. Then, on the backend server, verify the integrity and authenticity of the ID token and retrieve the user ID (uid) from it.

#### Retrieve ID token on client side

When we sign in Firebase creates ID token that uniquely identifies the user. This ID token can be re-used to identify the user on our custom backend server. See the example below on how to get the ID token from the signed-in user:

```js
firebase
    .auth()
    .currentUser.getIdToken()
    .then((idToken) => {
        // Send token to your backend using HTTPS
    })
    .catch((error) => {
        console.log(error.code, error.message);
    });
```

#### Verify ID token on the backend server

Once the ID token has been passed from the client app, we use the build-in method `verifyIdToken()` from the Firebase Admin SDK to verify and decode the ID token on the server. If the provided ID token has the correct format, is not expired, and is properly signed-in, then we can grab the uid of the user.

```js
// idToken comes from the client app
admin
    .auth()
    .verifyIdToken(idToken)
    .then((decodedToken) => {
        const uid = decodedToken.uid;
        console.log(uid);
    })
    .catch((error) => {
        console.log(error.code, error.message);
    });
```

While this is a useful way to verify users on the backend server, there is one limitation faced whilst building my app. The ID tokens have a validity period of only one hour. In other words, once the ID token has been created, it lives for one hour even after the user has been sign out. Currently, there is no Firebase API to check if the user has been signed-in/out using the Admin SDK. As a work around to overcoming this limitation, continue reading the next section below.

## Solution

Before we make a request to the backend server from our client app, we need to store the user ID token somewhere in the database. In our case we are going to use Firestore. We next compared the stored ID token in our database to the ID token of the user that we requested. Here are some examples below on how we can store our ID token in Firestore.

```js
const tokenId = firebase.auth().currentUser.getIdToken(true); // With "true", we force refresh of new token
const userUid = firebase.auth().currentUser.uid;

// Add a new document in collection "tokens". We are using uid to name the document
firebase
    .firestore()
    .collection("tokens")
    .doc(userUid)
    .update({
        token: tokenId,
    })
    .then(() => {
        console.log("Token successfully written in the database!");
    })
    .catch((error) => {
        console.log(error.code, error.message);
    });
```

> **Note:** We first need to create the collection "tokens" with the document named with the user "uid" before hand. Ideally, that would be when a user has been created. We can trigger Cloud Functions on user creation and deletion. Please refer to the following link for more details on how we can trigger Cloud Functions when user has been created [link](https://firebase.google.com/docs/functions/auth-events).

Now we need to add security rules to our Firestore where only the signed-in user can update its token based on its own uid. The Firestore rules are located in the Firebase console, under the Rules tab in the Firestore Database tab. Here is an example on how to add security rules.

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /tokens/{id}/{u=**} {
      allow read, write: if (isSignedIn() && isUser(id));
    }
    match /{document=**} {
      allow read, write: if false;
    }
    function isSignedIn() {
      return request.auth != null;
    }

    function isUser(uid) {
      return uid == request.auth.uid;
    }
  }
}
```

The explanation of the code above can be found below:

-   Documents under the collection "tokens" can be read and written only if their document id is the same as the sent request's uid.
-   The rest of the collection are only accessible from the backend server using the Firebase Admin SDK.
-   `isSignedIn()` function checks if request is authorised.
-   `isUser(id)` function checks if id matches the authorised request's uid.

Lastly on the backend server we compare both ID tokens, one that we've received from the client app and the one we have stored in the Firestore. If the tokens are the same, then the user is granted access to resources in other Firebase products.

> **Note:** To avoid potential security attacks, make sure you remove the user ID token in the Firestore document when user has signed-out.

## Conclusion

1. Firebase as a platform offers a wide range of services to developers to build, improve, and grow their apps with little or almost no effort.
2. Users can be authenticated from the client app using Firebase Client SDK without a custom backend server.
3. To be able to interact with Firebase from a backend server, use the Firebase Admin SDK.
4. For verifying ID Tokens on the server, use the build-in method `verifyIdToken()` from the Firebase Admin SDK to verify and decode the ID token on the server. However, note the limitation of ID tokens having a validity period of only one hour; and the ID token remaining active even after the user has signed-out.
5. A solution to verify only signed-in users on the server is by storing the user ID token in the Firestore and comparing that with the ID token that has been sent from the client app.

---
