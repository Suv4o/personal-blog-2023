---
title: Nest.js @CurrentUser Custom Decorator
description: This blog article is a continuation from the previous blog article about Nest.js Authorisation with Firebase Auth. If you have’t read that article you will not be able to follow along. The previous article can be found below. In this article we will be using custom route decorators in Nest. We will be creating our own @CurrentUser decorator and use it in the module controllers anytime we want to get the current logged user. Let’s have a look at how we can achieve this.
image: https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_750,e_sharpen:100/v1665138447/blog/nestjs-current-user-custom-decorator/nestjs-current-user-custom-decorator
type: article
published: 10th Oct 2022
readTime: 5
author: Aleksandar Trpkovski
articleTags:
    - Nest.js
    - Firebase
    - Node.js
---

# Nest.js @CurrentUser Custom Decorator

_{{$document.published}} • {{$document.readTime}} min read — by **[{{$document.author}}](/)**_

::tag-pills{:tags="articleTags"}
::

![Landing Image](https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_750,e_sharpen:100/v1665138447/blog/nestjs-current-user-custom-decorator/nestjs-current-user-custom-decorator)

> This blog article is a continuation from the previous blog article about Nest.js Authorisation with Firebase Auth. If you have’t read that article you will not be able to follow along. The previous article can be found at the following [link](https://www.trpkovski.com/2022/10/07/nestjs-authorisation-with-firebase-auth/).

In this article we will be using custom route decorators in Nest. We will be creating our own `@CurrentUser` decorator and use it in the module controllers anytime we want to get the current logged user. Let’s have a look at how we can achieve this.

## Assign claims to the `request` object in our Guard.

First, make small changes to our `auth.guard.ts` file. Our auth guard code should appear as follows:

```ts
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { FirebaseAdmin } from "../../config/firebase.setup";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private readonly admin: FirebaseAdmin
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const app = this.admin.setup();
        const request = context.switchToHttp().getRequest();
        const idToken = context.getArgs()[0]?.headers?.authorization.split(" ")[1];

        const permissions = this.reflector.get<string[]>("permissions", context.getHandler());
        try {
            const claims = await app.auth().verifyIdToken(idToken);

            if (claims.role === permissions[0]) {
                request.claims = claims;
                return true;
            }
            throw new UnauthorizedException();
        } catch (error) {
            console.log("Error", error);
            throw new UnauthorizedException();
        }
    }
}
```

The two changes made to the existing file are:

-   Getting the request object: `const request = context.switchToHttp().getRequest()`;
-   Assigning the user claims in a new property in the request object: `request.claims = claims;`

We will next create an interceptor that will help us to get the current user from Firebase.

## Create an Interceptor

Create a new directory in `src/` called `interceptors/` . Inside the directory, create a new file called `current-user.interceptor.ts` and place the following code:

```ts
import { Injectable, NestInterceptor, ExecutionContext, CallHandler, BadRequestException } from "@nestjs/common";
import { FirebaseAdmin } from "../../config/firebase.setup";

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
    constructor(private readonly admin: FirebaseAdmin) {}

    async intercept(context: ExecutionContext, handler: CallHandler) {
        const app = this.admin.setup();
        const request = context.switchToHttp().getRequest();

        try {
            const user = await app.auth().getUser(request.claims.uid);
            request.currentUser = user;
        } catch (error) {
            console.log("Error", error);
            throw new BadRequestException();
        }
        return handler.handle();
    }
}
```

Let me explain what is going on in the code above.

From the `claims` in the `request` object we can obtain the user’s `uid`. Calling `getUser()` firebase auth function with the `uid`, we can obtain the user’s details. Lastly, we assigned that user in the request object `request.currentUser = user`.

## Create `@CurrentUser` Decorator

Create a new file in `src/decorators/` directory called `current-user.decorators.ts`. Inside this directory, place the following code:

```ts
import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import * as adminTypes from "firebase-admin";

type UserRecord = keyof adminTypes.auth.UserRecord;

export const CurrentUser = createParamDecorator((data: UserRecord, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return data ? request.currentUser?.[data] : request.currentUser;
});
```

In our custom decorator, we’ve returned the current user from the `request` object.

We can also pass data to our custom decorator by using the `data` parameter in the `createParamDecorator` function. In our case, we can pass any user property. If a user property is passed then only that property will be returned. If there is nothing passed then the whole user object is returned. To make sure that only user property is passed in the `data` parameter, we create a `type` that can be any property of the user object. We can accomplish this via the following:

First, import `firebase-admin`

```ts
import * as adminTypes from "firebase-admin";
```

Then create a `type` called `UserRecord` from `auth.UserRecord` interface. Get all user properties and assign them to our type `UserRecord` by using the TypeScript built in method called `keyof`.

```ts
type UserRecord = keyof adminTypes.auth.UserRecord;
```

Lastly, assign that type to the data Object:

```ts
async (data: UserRecord, context: ExecutionContext) => {
...
```

## Use `@CurrentUser` Decorator

To be able to use our `@CurrentUser` decorator in our application, we will first need to import both the `CurrentUserInterceptor` and `CurrentUser` decorator inside our controller, and then call `CurrentUserInterceptor` inside the `@UseInterceptors` decorator.

Our `app.controller.ts` file should appear as follows:

```ts
import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { Auth } from './decorators/auth.decorator';
import { CurrentUser } from './decorators/current-user.decorators';
import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';

@Controller()
@UseInterceptors(CurrentUserInterceptor)
export class AppController {
  @Get('/morning')
  @Auth('ADMIN')
  goodMorning(@CurrentUser('email') email: string) {
    return 'Good Morning!' + email;
  }
...
```

In the example above, our `@CurrentUser` decorator will return the user’s `email` only. We can pass any user’s property we want. For example, we can pass `uid`, `displayName`, `phoneNumber` etc. If we don’t pass anything, the `@CurrentUser` will return the whole user object.

And that’s all!

All examples above can be found in the following Github repository [link](https://github.com/Suv4o/nest-current-user-custom-decorator).

## Conclusion

1. In this article, we created a custom decorator called `@CurrentUser` that will help us to get the user in the module controller.
2. To be able to get the current user, we made use of a custom interceptor in Nest.
3. In our custom decorator we can also pass data. To be able to verify the data that is passed, we created a `type` called `UserRecord` from the `auth.UserRecord` interface. With the TypeScript built in method called `keyof`, we were able to extract all the properties from the `auth.UserRecord`.
4. This article was continuation from the previous article about Nest.js Authorisation with Firebase Auth. If you have’t read that article, you can find the article in the following [link](https://www.trpkovski.com/2022/10/07/nestjs-authorisation-with-firebase-auth/).
