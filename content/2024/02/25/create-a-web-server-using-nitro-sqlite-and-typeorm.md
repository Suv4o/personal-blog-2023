---
title: Create a Web Server using Nitro, SQLite and TypeORM
description: If you're familiar with Nuxt.js, you might know that the latest version, Nuxt version 3, runs on a new server engine called Nitro. Nitro isn't just used in Nuxt, it's also an independent open-source framework for developing web server applications. It provides several built-in features that make it a modern, user-friendly backend framework. Nitro is open-source and maintained by the same core team as Nuxt.js. In this blog post, we'll show you how to build a simple web server using Nitro and connect it to an SQLite database. We'll also explain the process of database migration with TypeORM, a popular typescript library, introduce the widely-used pattern for validating request data, the Data Transfer Object (DTO), and utilise some of Nitro's built-in features to cache results.
image: https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_1200,e_sharpen:100/v1708844513/blog/create-a-web-server-using-nitro-sqlite-and-typeorm/create-a-web-server-using-nitro-sqlite-and-typeorm_ozdamt
keywords:
    - Nuxt.js
    - Nitro.js
    - TypeScript
    - SQLite
    - TypeORM
    - Data Transfer Object
    - DTO
    - Class Validator
    - Decorators
    - Web Development
    - Development
type: page
blog: post
published: 25th February 2024
readTime: 12
author: Aleksandar Trpkovski
articleTags:
    - Nitro
    - BackEnd
    - TypeScript
---

# Create a Web Server using Nitro, SQLite and TypeORM

_{{$document.published}} • {{$document.readTime}} min read — by **[{{$document.author}}](/)**_

::tag-pills{:tags="articleTags"}
::

![Landing Image](https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_750,e_sharpen:100/v1708844513/blog/create-a-web-server-using-nitro-sqlite-and-typeorm/create-a-web-server-using-nitro-sqlite-and-typeorm_ozdamt)

If you're familiar with [Nuxt.js](https://nuxt.com/), you might know that the latest version, Nuxt version 3, runs on a new server engine called Nitro. Nitro isn't just used in Nuxt, it's also an independent open-source framework for developing web server applications. It provides several built-in features that make it a modern, user-friendly backend framework. Nitro is open-source and maintained by the same core team as Nuxt.js.

In this blog post, we'll show you how to build a simple web server using Nitro and connect it to an SQLite database. We'll also explain the process of database migration with TypeORM, a popular typescript library, introduce the widely-used pattern for validating request data, the Data Transfer Object (DTO), and utilise some of Nitro's built-in features to cache results.

## Create a Nitro Web Server

First, we need to create a new project using the following command in the terminal of your choice. We will name our project `nitro-sqlite`.

```bash
npx giget@latest nitro nitro-sqlite
```

In this article, we're going to use `yarn` as a package management tool, but feel free to use your preferred one.

We will need to install the dependencies and finally run the development server:

```bash
cd nitro-sqlite
yarn install
yarn dev
```

If you open your browser and navigate to `http://localhost:3000`, you will see the following:

```json
{
    "nitro": "Is Awesome!"
}
```

Great, we've successfully set up our Nitro web server.

## Database Setup

In this project, we'll be using SQLite, but the same setup can be applied to any database. We'll establish the database using a popular Object-Relational Mapping (ORM) library in TypeScript, [TypeORM](https://typeorm.io/). TypeORM simplifies the creation and querying of data from a relational database using an object-oriented approach, assists in defining the database schema, and manages migrations. We'll explore these features later. For now, let's install the required libraries:

```bash
yarn add reflect-metadata sqlite3 typeorm
```

```bash
yarn add -D ts-node @types/node typescript rollup-plugin-typescript2
```

In `nitro.config.ts`, import the rollup plugin `rollup-plugin-typescript2` and adjust the TypeScript compiler options before proceeding with the database setup. Ensure that your `nitro.config.ts` looks like the following:

```ts
import typescript from "rollup-plugin-typescript2";

export default defineNitroConfig({
    rollupConfig: {
        plugins: [typescript()],
    },
    typescript: {
        tsConfig: {
            compilerOptions: {
                lib: ["es2021"],
                target: "es2021",
                module: "es2022",
                moduleResolution: "node",
                allowSyntheticDefaultImports: true,
                emitDecoratorMetadata: true,
                experimentalDecorators: true,
                sourceMap: true,
            },
        },
    },
});
```

Without the above settings, I encountered several compiler errors with the TypeORM setup, so it's necessary to ensure the compiler options are set as described above.

Next, we will create a file named `ormconfig.ts` in the root of the project. This ORM configuration will be used when we create our migrations. The content of the `ormconfig.ts` file should look like this:

```ts
import { DataSource } from "typeorm";

const dataSource = new DataSource({
    type: "sqlite",
    database: "database.sqlite",
    synchronize: false,
    logging: false,
    subscribers: [],
    entities: ["entity/**/*{.js,.ts}"],
    migrations: ["migrations/**/*{.js,.ts}"],
});

export default dataSource;
```

In the configuration settings, we named our database `database.sqlite`, but the name is entirely optional. We also set up the entities (the database schema we are going to create) to be found in the `/entity` directory, and the migrations we will create to be stored in the `/migrations` directory at the root of the project.

Next, we will create the following directories at the root of the project: `/entity` and `/migrations`. And also add the following line in `package.json` in the script section:

```json
"scripts": {
		...
    "typeorm": "typeorm-ts-node-esm -d ormconfig.ts"
 },
```

### Defining the User entity

TypeORM utilises TypeScript decorators to define entities and relationships directly within your TypeScript classes. Models can be defined using classes with TypeScript decorators for properties and relationships such as `@Entity`, `@Column` etc.

For a comprehensive understanding of all decorators, refer to the TypeORM official [documentation](https://typeorm.io/). In this blog, we will only demonstrate how to model a simple `User` table.

Let's create our User entity within the `/entity` directory. In the `/entity` directory, we will define a file named `User.ts` with the following content:

```ts
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("user")
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    age: number;
}
```

The above code defines a simple database table named `user` with four columns: `id`, `firstName,` `lastName`, and `age`.

### Create a migration for the User table

Next, we need to create a migration so the User entity will be translated into a database table. To do this, run the following command in your terminal of choice:

```bash
yarn typeorm migration:generate --name=create-user-table

```

We name our migration `create-user-table`. This creates a migration inside the `/migrations` directory. Each migration's name will be created with a timestamp followed by the name of the migration. In my case, the migration file was called: `1708245318068-create-user-table.ts`.

The migrations can then be run or reverted with the following terminal commands:

```bash
yarn typeorm migration:run

```

or

```bash
yarn typeorm migration:revert

```

Once the migration is run, the `database.sqlite` database will have two tables: the `user` table and the `migrations` table.

Now we have a database set up, but it's empty. We need to define a couple of endpoints in Nitro so we can add and read users from the database. But before that, we need to configure one more TypeORM setting. Let's do that first.

### TypeORM Configuration

To use TypeORM for creating and querying users in the database, we need to configure it. This enables us to use the entities and migrations we create.

Create a `/config` directory in the root of the project. Inside this directory, create a file named `config/typeorm.config.ts` with the following configuration:

```ts
import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../entity/User";
import { CreateUserTable1708227011732 } from "../migrations/1708227011732-create-user-table";

const dataSource = new DataSource({
    type: "sqlite",
    database: "database.sqlite",
    synchronize: false,
    logging: false,
    subscribers: [],
    entities: [User],
    migrations: [CreateUserTable1708227011732],
});

export default dataSource;
```

This will be very similar to the `ormconfig.ts` file, except it imports the User entity and the migrations and adding them to the entities and migrations arrays.

### Initialising the database with Nitro Plugins

Nitro uses a plugin system to extend its runtime behaviour. This is quite useful if you want to add custom behaviour to the web server. Nitro provides several hooks such as on `request`, `beforeResponse`, on application `close`, etc. For more details, refer to the Nitro documentation [here](https://nitro.unjs.io/guide/plugins#available-hooks).

In our case, we will utilise on `request` and `beforeResponse` hooks to initialise and destroy the database respectively.

To achieve this, create a `/plugins` directory in the root of the project, and then create the following file: `/plugins/initializing-database.ts`. Add the following code to this file:

```ts
import dataSource from "../config/typeorm.config";

export default defineNitroPlugin((nitro) => {
    nitro.hooks.hook("request", async () => {
        await dataSource.initialize();
    });
    nitro.hooks.hook("beforeResponse", async () => {
        await dataSource.destroy();
    });
});
```

As long as the plugin is created inside the plugins directory, Nitro will automatically import the plugin, so no additional action is required.

We now have everything we need for the database setup. Next, we're going to create the user endpoint to create and read users from the database.

## User endpoints

Nitro supports file-based routing for your API routes. You can define a route simply by creating a file inside the `api/` or `routes/` directory.

In this project, we will define three routes:

- `POST` route to create users: `/create-user`
- `GET` route to retrieve all users: `/get-users`
- `GET` route to retrieve a single user: `/get-user/:id`

Let's begin with the first route for creating users.

### Create a user endpoint

In Nitro, we can add specific utils inside the `utils/` directory, and they will be automatically imported when used. Every export in the `utils` directory and its subdirectories becomes available globally in your application. For a cleaner implementation, we'll take advantage of this auto-import feature in Nitro.

For our user endpoints, we'll define utility functions inside the `/utils` directory. Let's define the following file inside the `utils/user.ts` directory:

```ts
import dataSource from "../config/typeorm.config";
import { User } from "../entity/User";

export async function createUser(body: User) {
    const user = new User();
    user.firstName = body.firstName;
    user.lastName = body.lastName;
    user.age = body.age;

    try {
        await dataSource.manager.save(user);
        return { success: true, message: "User created" };
    } catch (error) {
        console.error(error);
        return { success: false, message: "Failed to create user" };
    }
}
```

Here, we're defining the logic for creating a user by utilising the ORM capability in TypeORM.

Then, inside the `/routes` directory, we're going to define the following file `routes/create-user.post.ts`.

```ts
export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    return await createUser(body);
});
```

This will automatically create an endpoint `/create-user` that will receive a `post` request.

We use the Nitro function `readBody` to access the body of the request. This function is automatically imported by Nitro, so we don't need to import it separately.

You can call this endpoint with the following body payload:

```json
POST http://localhost:3000/create-user
Content-Type: application/json
{
    "firstName": "Aleks",
    "lastName": "Trpkovski",
    "age": 43
}
```

### Read users endpoint

Similar to how we define the user creation endpoint, we will now create an endpoint to retrieve all users. In the user utility function `utils/user.ts`, we will add another function to return all users:

```ts
export async function getUsers() {
    try {
        const users = await dataSource.manager.find(User);
        return { users };
    } catch (error) {
        console.error(error);
        return { success: false, message: "Failed to get users" };
    }
}
```

Next, within the `/routes` directory, we will define the following file `routes/get-users.get.ts`.

```ts
export default defineEventHandler(async (event) => {
    return await getUsers();
});
```

The above endpoint will return all the users from the database.

### Read a single user endpoint

Finally, we will create an endpoint that, given an id, returns a single user associated with that id. Similar to the previous process, we are adding another function to the utility function `utils/user.ts`:

```ts
export async function getUser(id: number) {
    try {
        const user = await dataSource.manager.findOne(User, {
            where: { id },
        });
        return { user };
    } catch (error) {
        console.error(error);
        return { success: false, message: "Failed to get users" };
    }
}
```

Next, create the endpoint `routes/get-user/[id].get.ts`. Note that we've created a new directory inside the `/routes` called `/get-user`, and inside this directory, a file named `[id].get.ts`. If you're familiar with Nuxt.js, this pattern will be recognisable, as Nitro also uses it. The name within the square brackets represents the name of the dynamic parameter we want to pass to the endpoint. For example, in our case, the endpoint `/get-user/:id` will have a dynamic `id` that can be any user id. Here's how the `[id].get.ts` file should be implemented:

```ts
export default defineEventHandler(async (event) => {
    const userId = Number(getRouterParam(event, "id"));
    return await getUser(userId);
});
```

We use the Nitro function `getRouterParam` to access the parameter's id. This function is automatically imported by Nitro, so we don't need to import it separately.

With that, we've defined the three endpoints for creating and reading users. Next, we'll show how to validate data using DTOs, ensuring the parameters passed during user creation follows the database schema and prevent the inclusion of unsupported types.

## Use DTO to validate the request

DTOs are a design pattern used in applications to hold and transfer data between different layers. One common application of DTOs is to define validation logic directly within their classes or functions, offering control over validation rules. This can be beneficial for validating data on each request, ensuring data integrity before it reaches the database.

Currently, our `create-user` endpoint can accept any type of data. For instance, a number could be passed into the `firstName` field, or a string could replace a number in the `age` property. To prevent these scenarios, we need to implement validation rules.

To address this, we will use the `class-validator` library. This library employs classes and TypeScript decorators, similar to TypeORM, to define validation rules. Let's start by installing the library:

```bash
yarn add class-validator
```

First, we will create a directory at the root of the project called `/dtos`. Inside this directory, we will create the following file: `create-user.dto.ts`, where we define the validation.

```ts
import { validateOrReject, IsString, IsNotEmpty, IsAlpha, IsNumber } from "class-validator";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @IsAlpha()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    @IsAlpha()
    lastName: string;

    @IsNumber()
    @IsNotEmpty()
    @Max(99)
    age: number;
}

const createUserDto = defineEventHandler(async (event) => {
    const userRequestBody = await readBody(event);

    const user = new CreateUserDto();
    user.firstName = userRequestBody.firstName;
    user.lastName = userRequestBody.lastName;
    user.age = userRequestBody.age;

    try {
        await validateOrReject(user);
    } catch (errors) {
        const res = event.node.res;
        res.statusCode = 400;
        res.end(JSON.stringify(errors, null, 2));
    }
});

export default createUserDto;
```

Firstly, we will define the validation schema class `CreateUserDto`. We use decorators to define validation rules for each field. For more details on available decorators, refer to the `class-validator` package documentation [here](https://www.npmjs.com/package/class-validator).

You might notice that this function looks very similar to the routes functions. We use the `defineEventHandler` handler and read the event body same as we do in the `create-user.post.ts` route. To give you context, this is a middleware that we will add to the existing `create-user.post.ts` function to handle validation for each request. If the body data does not follow the rule, it will return a 400 error with an explanation of the error.

Let's see how we can do that. Modify the `create-user.post.ts` as follows:

```ts
import createUserDto from "../dtos/create-user.dto";

export default defineEventHandler({
    onRequest: [createUserDto],
    async handler(event) {
        const body = await readBody(event);
        return await createUser(body);
    },
});
```

As you can see, we added an `onRequest` property and included the `createUserDto` function in the array. This will be run first before each request and validate the data before continuing with any other operation. If the rules are broken, the request will not continue.

For example, if we added a number to the `firstName` and the rules are set to accept only alphabetic characters, we would get the following error:

```json
[
    {
        "target": {
            "firstName": "Nicole123",
            "lastName": "Tesla",
            "age": 43
        },
        "value": "Nicole123",
        "property": "firstName",
        "children": [],
        "constraints": {
            "isAlpha": "firstName must contain only letters (a-zA-Z)"
        }
    }
]
```

Or if we add an age of 101, this will result in an error because we have set rules to accept a maximum age of 99.

```json
{
    "target": {
      "firstName": "Nicole",
      "lastName": "Tesla",
      "age": 101
    },
    "value": 101,
    "property": "age",
    "children": [],
    "constraints": {
      "max": "age must not be greater than 99"
    }
  }
]
```

## Cacheing

Nitro provides a caching system where we can easily cache certain routes. For more details on how caching works and what options are available, refer to the Nitro documentation [here](https://nitro.unjs.io/guide/cache).

For now, we will demonstrate how to modify the `get-users.get.ts` type to handle caching for 10 seconds. We can modify the endpoint as follows:

```ts
export default defineCachedEventHandler(
    async () => {
        return await getUsers();
    },
    { maxAge: 10 /* 10 seconds */ }
);
```

That's it. Replacing the function to `defineCachedEventHandler` and adding an option of `maxAge` will handle this automatically.

## Conclusion

Nitro is an open-source, user-friendly backend framework for Node.js. It's maintained by the same core team behind Nuxt.js. The framework offers numerous built-in features, making it a great choice for modern web development. These features include file-based routing, auto imports, built-in middleware, caching, and a plugin-based system for easy extendability.

Aside from the built-in features in Nitro, we also demonstrate how to start and create a database using SQLite and TypeORM. This includes adding migrations and integrating well-known patterns such as DTOs for validating request.

The blog post above provides a basic app to help you get started. It can serve as your starting point. Feel free to check out the GitHub repository containing the code for this project [here](https://github.com/Suv4o/nitro-sqlite).
