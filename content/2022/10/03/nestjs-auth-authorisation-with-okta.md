---
title: Nest.js Auth/Authorisation with Okta
description: In this blog article we will be creating a Nest application where users (with different roles) can sign-up and sign-in to the application. Specific permissions can be configured for each user access to specific endpoints, based on the user role. We are going to use Okta to help us with user Authentication and Authorisation. Okta is an Identity as a Service (IDaaS). This is a cloud-based authentication or identity management subscription service. Okta can be used for a number of different applications such as Adaptive multi-factor authentication, single sign-on, Universal Directory etc. Nest is a progressive Node.js framework for building efficient, reliable and scalable server-side applications with TypeScript.
image: https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_1200,e_sharpen:100/v1664708491/blog/nestjs-auth-authorisation-with-okta/nestjs-auth-authorisation-with-okta
keywords:
    - Nest.js Auth/Authorisation with Okta
    - Nest.js
    - TypeScript
    - Authentication
    - Authorization
    - Okta Auth
    - Development
    - Web Development
type: page
blog: post
published: 3rd Oct 2022
readTime: 16
author: Aleksandar Trpkovski
articleTags:
    - Nest.js
    - TypeScript
    - Node.js
---

# Nest.js Auth/Authorisation with Okta

_{{$document.published}} • {{$document.readTime}} min read — by **[{{$document.author}}](/)**_

::tag-pills{:tags="articleTags"}
::

![Landing Image](https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_750,e_sharpen:100/v1664708491/blog/nestjs-auth-authorisation-with-okta/nestjs-auth-authorisation-with-okta)

## What is Nest (NestJS)?

[Nest](https://nestjs.com/) is a progressive Node.js framework for building efficient, reliable and scalable server-side applications with TypeScript.

Under the hood, Nest makes use of two javascript backend frameworks [Express](https://expressjs.com/) (the default) and can also be configured to use with [Fastify](https://www.fastify.io/) as well!

The examples in this blog article leverages on the default Express framework.

## What is Okta?

[Okta](https://www.okta.com/) is an Identity as a Service (IDaaS). This is a cloud-based authentication or identity management subscription service. Okta can be used for a number of different applications such as [Adaptive multi-factor authentication](https://www.okta.com/au/blog/2016/12/two-factor-authentication-vs-multi-factor-authentication-what-are-the-risks/), [single sign-on](https://www.okta.com/au/products/single-sign-on/), [Universal Directory](https://www.okta.com/au/products/universal-directory/) etc.

In this blog article we will be creating a Nest application where users (with different roles) can sign-up and sign-in to the application. Specific permissions can be configured for each user access to specific endpoints, based on the user role. We are going to use Okta to help us with user Authentication and Authorisation.

## Create a Nest Project

Before we continue let’s first install [Nest CLI](https://docs.nestjs.com/cli/overview). That will enable us to efficiently create this project. To install Nest CLI globally, use the following command in your terminal:

```bash
npm install -g @nestjs/cli
```

Setting up a new project is quite simple with Nest CLI. We can create a new Nest project with the following commands in our terminal:

```bash
nest new nest-auth-with-okta
```

Next, choose `npm` for this project.

```bash
? Which package manager would you ❤️ to use?
❯ npm
  yarn
  pnpm
```

```bash
? Which package manager would you ❤️ to use? npm
▹▹▹▹▸ Installation in progress... ☕
```

Lastly, navigate to the newly created `nest-auth-with-okta` directory and run this project.

```bash
$ cd nest-auth-with-okta
$ npm run start
```

If we navigate to the [**http://localhost:3000**](http://localhost:3000) in the browser, we will be able to see **Hello World!**

Now, let’s have a look at the folder structure in our Nest project. Inside the `nest-auth-with-okta` directory we have `node_modules`, a few other boilerplate files and a `src/` directory populated with several core files.

`app.controller.spec.ts`

`app.controller.ts`

`app.module.ts`

`app.service.ts`

`main.ts`

Cool, this means that we have successfully created our Nest project.

## Getting started with Okta

We will now create our developer account with Okta.

Okta’s Developer Edition provides a free, no time limit access to the most key developer features. You can sign-up [here](https://developer.okta.com/signup/).

Next, we will create an app integration. We can do so by signing in to the Okta dashboard and navigating to Applications → Applications → Create App Integration.

![Creating developer account with Okta](https://res.cloudinary.com/suv4o/image/upload/c_scale,f_auto,w_750/v1664763235/blog/nestjs-auth-authorisation-with-okta/nestjs-auth-authorisation-with-okta_ryik8s)

From the prompt, we choose API Services and click Next.

![Creating developer account with Okta, choosing API Services and click Next.](https://res.cloudinary.com/suv4o/image/upload/c_scale,f_auto,w_750/v1664763462/blog/nestjs-auth-authorisation-with-okta/nestjs-auth-authorisation-with-okta_i0rynr)

Lastly, we enter the name of the our App integration and click Save.

That’s all we need for now. Later in the blog article, we will come back to setup some more things. Until then, let’s move to the next section where we start implementing our Authentication in Nest.

## Create a user module

We are going to create a user module, user controller and user service. We can do that efficiently with Nest CLI.

First, we create the user module:

```bash
nest g module user
```

Nest CLI will automatically create `user.module.ts` file under the `user` directory and update the `app.module.ts` file accordingly.

Next, we create the controller:

```bash
nest g controller user --no-spec
```

You would have noticed that we use `--no-spec` flag at the end of the command. This allows us to exclude the `user.controller.spec.ts` file.

Lastly, we create the service file:

```bash
nest g service user --no-spec
```

## Nest Configuration

Applications often run in different environments. Depending on the environment, different configuration settings should be used.

Nest provides a `@nestjs/config` package out-of-the box. In order to setup our configuration, we need to install it first.

```bash
npm i --save @nestjs/config
```

Once the installation process is complete, we import the `ConfigModule`. We need to import the module into the root `app.module.ts` file. Next, add the config module into the imports array. The code inside `app.module.ts` now will look like this:

```ts
import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UserModule } from "./user/user.module";
import { ConfigModule } from "@nestjs/config";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ".env",
        }),
        UserModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
```

Inside `ConfigModule.forRoot` we pass an object to further configure the `ConfigModule`. First, set the property `isGlobal` to be `true`. This will help us to use `ConfigModule` in other modules so we don’t need to import our module into each module we use. Secondly, set `envFilePath` to be `.env`. This will load and parse a `.env` so that we can access the environmental variable throughout the app using `process.env`.

Lastly, create a `.env` file at the root of this project.

We are now all set with the `ConfigModule` . Let’s move on to setting up Okta in our Nest app.

## Okta Setup

Head back to the Okta dashboard to get the Client ID and Okta domain. To find these values, we need to navigate to Applications → Applications → App name set earlier.

![Okta setup.](https://res.cloudinary.com/suv4o/image/upload/c_scale,f_auto,w_750/v1664763933/blog/nestjs-auth-authorisation-with-okta/nestjs-auth-authorisation-with-okta_v853m2)

Create a token on the Okta dashboard by navigating to Security → API → Create Token.

Now, with all these values: Client ID, Okta Domain and the Token, we can set the environmental variables in our `.env` file:

```plain
OKTA_ORG_URL=YOUR_OKTA_DOMAIN
OKTA_TOKEN=YOUR_TOKEN
OKTA_CLIENT_ID=YOUR_CLIENT_ID
OKTA_AUDIENCE=api://default
```

For the Audience, we set `api://default` that is the default value in Okta.

Next, we create a `config/` directory at the root of the Nest project. Inside this directory, create two files:

File 1: `auth.config.ts` and place the following code:

```ts
import { Injectable } from "@nestjs/common";

@Injectable()
export class AuthConfig {
    public issuer: string = process.env.OKTA_ORG_URL + "oauth2/default";
    public clientId: string = process.env.OKTA_CLIENT_ID;
    public audience: string = process.env.OKTA_AUDIENCE;
}
```

File 2: `okta.sdk.config.ts` and place the following code:

```ts
import { Injectable } from "@nestjs/common";

@Injectable()
export class OktaSdkConfig {
    public orgUrl: string = process.env.OKTA_ORG_URL;
    public token: string = process.env.OKTA_TOKEN;
}
```

In order to use these files across our Nest application, we will first need to import the files and then define them as providers in each of the modules. We will do that later as we progress with our application.

## Define Auth Guards

The purpose of implementing an authentication and authorisation is to be able to protect certain parts of the application to only authenticated users with a specific permissions. This might sound complicated, but with Nest and Okta this implementation is made straightforward.

Nest has Guards to handle all of this out of the box. Guards have a single responsibility. They determine whether a given request should be handled by the route handler or not, depending on certain conditions like permissions or roles. For more details on how Guards work inside Nest, please refer to this [link](https://docs.nestjs.com/guards).

Let’s define our Guard. Create a new directory inside the `src/` called `guards/`. Within the directory, create a file `auth.guard.ts` where we will place the logic for our Okta authentication Guard.

Before proceeding with the Guard implementation, install and setup the Okta JWT Verifier for Node.js. Install the [Okta JWT Verifier](https://www.npmjs.com/package/@okta/jwt-verifier) with the following command:

```bash
npm install --save @okta/jwt-verifier
```

Once the Okta JWT Verifier is installed, implement the Guard logic. You can do so by placing the following code into `auth.guard.ts` file.

```ts
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";
import * as OktaJwtVerifier from "@okta/jwt-verifier";
import { AuthConfig } from "../../config/auth.config";
import { Reflector } from "@nestjs/core";

@Injectable()
export class OktaGuard implements CanActivate {
    oktaJwtVerifier: OktaJwtVerifier;

    constructor(
        private reflector: Reflector,
        private readonly authConfig: AuthConfig
    ) {}

    jwtVerifier(permissions) {
        this.oktaJwtVerifier = new OktaJwtVerifier({
            issuer: this.authConfig.issuer,
            clientId: this.authConfig.clientId,
            assertClaims: {
                "permissions.includes": permissions,
            },
        });
    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const permissions = this.reflector.get<string[]>("permissions", context.getHandler());

        this.jwtVerifier(permissions);

        const token = context.getArgs()[0]?.headers?.authorization.split(" ")[1];
        return this.oktaJwtVerifier
            .verifyAccessToken(token, this.authConfig.audience)
            .then((details) => {
                console.log(details);
                return true;
            })
            .catch((err) => {
                console.log(err);
                throw new UnauthorizedException();
            });
    }
}
```

In order to use the Guard, we will first need to declare our custom decorator. Create a new directory inside the `src/` called `decorators/`. Inside the directory, create a file `auth.decorator.ts` where we can declare our custom decorator.

```ts
import { applyDecorators, UseGuards, SetMetadata } from "@nestjs/common";
import { OktaGuard } from "../guards/auth.guard";

export function Auth(...permissions: string[]) {
    return applyDecorators(SetMetadata("permissions", permissions), UseGuards(OktaGuard));
}
```

And that’s it. I will demonstrate how we can use this custom decorator to protect our endpoints later in this article.

We will now implement the user creation using the Okta Node.js SDK.

## User Creation with Okta Node.js SDK

We will first create users with specific permissions. The user creation will be handled by the Okta Node.js SDK. Let’s first install the [Okta Node.js SDK](https://www.npmjs.com/package/@okta/okta-sdk-nodejs) with the following command.

```bash
npm install @okta/okta-sdk-nodejs
```

Before we jump to the implementation on the user creation, a couple of things needs to be done beforehand. First, extend the user profile in the Okta dashboard with one additional attribute that is going to be an array of permissions. Secondly, create the Data Transfer Object (DTO) file where will define the user properties that will be validated on incoming requests.

### Add a new Attribute to the user profile

To add a `Permission` attribute, navigate to Discovery → Profile Editor → User (default) → Add Attribute in the Okta dashboard.

![Adding Permission attribute to Okta.](https://res.cloudinary.com/suv4o/image/upload/c_scale,f_auto,w_750/v1664764468/blog/nestjs-auth-authorisation-with-okta/nestjs-auth-authorisation-with-okta_muplt4)

In the dialog, select the following data: Data type to be array of strings, Display name: Permissions, Variable name: permissions, Description: Users Permissions, Attribute required: selected.

![Setting up Permission attribute to Okta.](https://res.cloudinary.com/suv4o/image/upload/c_scale,f_auto,w_750/v1664776160/blog/nestjs-auth-authorisation-with-okta/nestjs-auth-authorisation-with-okta_pp9nnk)

Upon saving the above attributes, our new attribute will be added to the list of attributes.

![New attribute will be added to the list of attributes.](https://res.cloudinary.com/suv4o/image/upload/c_scale,f_auto,w_750/v1664776285/blog/nestjs-auth-authorisation-with-okta/nestjs-auth-authorisation-with-okta_xxbonx)

### Create a DTO

We will now create a DTO inside our user module. Install two more libraries that will help us with the incoming request validation. We can do so by installing `class-validator`, and `class-transformer` with the following command:

```bash
npm install class-validator class-transformer --save
```

Next, create a new directory called `dto/` inside `src/user/`. Inside `dto/` create `user.dto.ts` file. The code in `user.dto.ts` file will look like this:

```ts
import { IsEmail, IsNotEmpty, MaxLength, MinLength, Matches, IsEnum, IsAlpha } from "class-validator";

enum Permissions {
    ADMIN = "ADMIN",
    USER = "USER",
    DEVELOPER = "DEVELOPER",
}

export class UserDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(20)
    @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,20}$/, {
        message: "password too weak",
    })
    password: string;

    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(20)
    @IsAlpha()
    firstName: string;

    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(20)
    @IsAlpha()
    lastName: string;

    @IsNotEmpty()
    @IsEnum(Permissions, { each: true })
    permissions: Permissions[];
}
```

We should expect five properties to be sent with the request: an email address, a strong password, users first and last name and user’s permissions (roles) which will accept three possible values, `ADMIN`, `USER` and `DEVELOPER`.

One more thing needs to be done to make the DTO work. We need to import and set the `ValidationPipe` in the `main.ts` file. Our `main.ts` file should look like this:

```ts
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe());
    await app.listen(3000);
}
bootstrap();
```

### User Creation

Before jumping on the user’s sign up implementation, we need to setup the [Okta Node.js SDK](https://www.npmjs.com/package/@okta/okta-sdk-nodejs). The Okta Node.js SDK can be installed with the following command:

```bash
npm install @okta/okta-sdk-nodejs
```

Next, create a file called `okta.setup.ts` inside the user’s module `src/user/`. Define the Okta Node.js SDK inside that file as follows:

```ts
import { Injectable } from "@nestjs/common";
import { OktaSdkConfig } from "../../config/okta.sdk.config";
import { Client } from "@okta/okta-sdk-nodejs";

@Injectable()
export class Okta {
    constructor(private readonly oktaSdkConfig: OktaSdkConfig) {}

    setup() {
        const client = new Client({
            orgUrl: this.oktaSdkConfig.orgUrl,
            token: this.oktaSdkConfig.token,
        });
        return client;
    }
}
```

To be able to use the setup above, declare it as a provider in our user module. Our `user.module.ts` file should look like this:

```ts
import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { OktaSdkConfig } from "config/okta.sdk.config";
import { Okta } from "./okta.setup";

@Module({
    imports: [],
    providers: [UserService, Okta, OktaSdkConfig],
    controllers: [UserController],
    exports: [UserService],
})
export class UserModule {}
```

We can now use Okta setup in the user’s service. Head over to the user’s service file and create a method called `createUser` inside the `UserService` class. The `user.service.ts` file should appear as follows:

```ts
import { BadRequestException, Injectable } from "@nestjs/common";
import { UserDto } from "./dto/user.dto";
import { Okta } from "./okta.setup";

@Injectable()
export class UserService {
    constructor(private readonly okta: Okta) {}

    async createUser(userRequest: UserDto) {
        const { email, password, firstName, lastName, permissions } = userRequest;
        const okta = this.okta.setup();

        const newUser = {
            profile: {
                email: email,
                login: email,
                firstName: firstName,
                lastName: lastName,
                permissions: permissions,
            },
            credentials: {
                password: {
                    value: password,
                },
            },
        };

        try {
            const user = await okta.createUser(newUser);
            return user;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }
}
```

We can make a use of this module inside user’s controller where we will now declare our endpoint. Our `user.controller.ts` file should look like this:

```ts
import { Controller, Post, Body } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserDto } from "./dto/user.dto";

@Controller("user")
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post("/signup")
    signup(@Body() userRequest: UserDto) {
        return this.userService.createUser(userRequest);
    }
}
```

And that’s it. We will next create our first user.

## Sign up Users with different permissions

To test the creation of new users, we will need a tool that will help us with the API server requests. The most popular tool for this purpose is an application called [Postman](https://www.postman.com/), it is free and easy to use. If you are a VSCode user, you can use an extension called [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client). REST Client allows you to send HTTP request and view the response in Visual Studio Code directly. All endpoints that we are going to test here in this article will be included in the `api.request.http` file in the root of the project so you can test this with the REST Client extension.

To signup a new user, we will create the following request in our local server:

```http
POST http://localhost:3000/user/signup HTTP/1.1
Content-Type: application/json

{
    "email": "admin@test.com",
    "password": "P@ssword1",
    "firstName": "Darrell",
    "lastName": "Werner",
    "permissions": ["ADMIN", "USER"]
}
```

With the above request, we have created a User with two permissions: `ADMIN` and `USER`. We can combine all three permissions.

Let’s now proceed to create two more users, but with different single permissions: `USER` and `DEVELOPER`. If we try to create a user with permissions that we have’t defined in our DTO enum Permissions, we will get an error:

```http
HTTP/1.1 400 Bad Request

{
  "statusCode": 400,
  "message": [
    "each value in permissions must be a valid enum value"
  ],
  "error": "Bad Request"
}
```

## Create guarded endpoints

Finally, we will create endpoints by using the Guard that was created earlier. Declare the `AuthConfig` as a provider in `app.module.ts`. Our `app.module.ts` will appear as follows:

```ts
import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { UserModule } from "./user/user.module";
import { ConfigModule } from "@nestjs/config";
import { AuthConfig } from "config/auth.config";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ".env",
        }),
        UserModule,
    ],
    controllers: [AppController],
    providers: [AuthConfig],
})
export class AppModule {}
```

Next, create three new endpoints:

1.  `/morning` which will be accessed by users with `ADMIN` and `USER` permissions only,
2.  `/afternoon` accessed by `DEVELOPER` users, and
3.  `/evening` that will be accessible by everyone.

Our `app.controller.ts` file will look like this:

```ts
import { Controller, Get } from "@nestjs/common";
import { Auth } from "./decorators/auth.decorator";

@Controller()
export class AppController {
    @Get("/morning")
    @Auth("ADMIN", "USER")
    goodMorning() {
        return "Good Morning!";
    }

    @Get("/afternoon")
    @Auth("DEVELOPER")
    goodAfternoon() {
        return "Good Afternoon!";
    }

    @Get("/evening")
    goodEvening() {
        return "Good Evening!";
    }
}
```

To test our newly created endpoints, we need to have an access token and have that included in the Authorisation header with each request we make to the guarded endpoints.

In order to get the access token we will need to setup the Okta client SDK. We will not go into the details of how to setup the client SDK at the moment. This will be a topic for a separate blog article. Okta has great examples of that topic with all major frontend frameworks. You can find the examples in the following [link](https://developer.okta.com/).

## Testing guarded endpoints

Let’s test out the protected endpoints with the access token obtained from the client app. We need to include the following in each request we make in the Authorisation header:

```http
GET http://localhost:3000/morning HTTP/1.1
Content-Type: application/json
Authorization: Bearer {USER_ACCESS_TOKEN}

{}
```

If the access token is from the admin@test.com user created earlier, we will get a success 200 response:

```http
HTTP/1.1 200 OK
Good Morning!
```

But if we try to access via the other two users we earlier created, we will get a 401 Unauthorised response:

```http
HTTP/1.1 401 Unauthorized
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

And that’s all!

All examples above can be found in the following Github repository [link](https://github.com/Suv4o/nest-auth-with-okta).

## Conclusion

1. This blog article shows how to sign up and sign in users with specific roles. Then giving those users access to only specific endpoints based on their roles. To accomplish that, we used Okta to help us with the users Authentication and Authorisation.
2. Okta’s Developer Edition provides a free with no time limit access to a variety of key developer features.
3. To create and validate users in our app we used two packages provided by Okta:
    - Okta JWT Verifier for Node.js [link](https://www.npmjs.com/package/@okta/jwt-verifier).
    - Okta Node.js Management SDK [link](https://www.npmjs.com/package/@okta/okta-sdk-nodejs).
4. Nest has built in Guards mechanisms to handle the protected endpoints. The official documentation has great examples on how to use [guards](https://docs.nestjs.com/guards).
5. To be able to get the access token, we will need to setup the Okta client SDK. Okta has great documentation and examples on that topic with all the major frontend frameworks. You can find these examples in the following [link](https://developer.okta.com/).
