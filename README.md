DISCLAIMER: THIS IS A PROJECT USED FOR LEARNING PURPOSE, STILL UNDER PROGRESS


# svelt-express-boilerplate
This repo contains a lil bit of the code iv used to start studying svelt with another stacks.


## Steps that I'v took
_First iv choose to use Svelte Kit to build this app_
* SvelteKit is an opinionated full stack framework that ties the frontend and backend together delivering the best developer and user experience

Because we’re using a full stack framework (SvelteKit) we can create endpoints that correspond to HTTP request methods such as GET and POST same as using a backend framework like Express.

* 1 - First I'v used this command to show me the boilerplateoptions and start my app: `npm svelt@next`
    - using the arrow keys iv choose the skeleton options (_the second one_)
The next instructions are pretty simple, but i will list here what i'v choose on the installer's questionary.
>   
    ✔ Where should we create your project - Iv use one of my studying folders (leave blank to use current directory).
    ✔ Which Svelte app template? › Skeleton project.
    ✔ Add type checking with TypeScript? › Yes, using TypeScript syntax.
    ✔ Add ESLint for code linting? >  Yes. (I like it).
    ✔ Add Prettier for code formatting? Yes (Default on mostly projects i work).
    ✔ Add Playwright for browser testing? No, not sure what is that and iam not focusing on it.
    ✔ Add Vitest for unit testing? Yes. I think i will create a few tests to leeave here.
After the installation:
* 2 - Run the command `yarn` to install the deps
    - This will install the package imported from the Skeleton svelte project.
    - Iv entered the `package.json` file and changed the "script" section to match this on running yarn dev
```
"scripts": {
	"dev": "vite dev --port 3000 --open",
    ...
},
```
* Now you can run: `yarn dev` and wait till it open on browser 
##### This is how the folder must be like: 
        ├── svelte-kit
        ├── src
        ├── static
            └── favicon.png
        ├── app.d.ts
        ├── app.html
        └── routes
            └── index.svelte
        ├── package.json
        ├── svelte.config.js
        ├── tsconfig.json
        ├── vite.config.js

#### Installing Prisma 
##### Prisma is a library that lets you write JavaScript instead of raw SQL for interacting with a database and it generates types for you.
Go to the terminal and run the follow command:

`npx prisma init --datasource-provider sqlite`.

This is going to create a prisma folder and set up the SQLite config for you. Inside the generated .env file is the DATABASE_URL, which you can change if you want to.

Since iam following an article about this, iam going to use the author's schema to begin: 
```
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model Tweet {
  id      Int      @id @default(autoincrement())
  url     String
  posted  DateTime
  content String
  likes   Int
  user    User     @relation(fields: [userId], references: [id])
  userId  Int
}

model User {
  id     Int     @id @default(autoincrement())
  email  String  @unique
  handle String  @unique
  name   String
  avatar String
  about  String
  tweets Tweet[]
  liked  Liked[]
}

model Liked {
  id      Int  @id @default(autoincrement())
  tweetId Int  @unique
  user    User @relation(fields: [userId], references: [id])
  userId  Int
}
```

* Just open the `schema.prisma` file and paste.
Now we have to generate the client and types by running the following command:
`npm i @prisma/client`.

Create the database for the schema: 
`npx prisma db push`

Now we have the database set and a base schema setted too.
Let's run `npx prisma studio` to open the client of prisma as graphical interface.

Moving foward, inside the Prisma Folder, create an Seed.ts file to provide seeders xD.

This is the `Seed.ts` source code: 
```
import PrismaClientPkg from '@prisma/client'

// Prisma doesn't support ES Modules so we have to do this
const PrismaClient = PrismaClientPkg.PrismaClient
const prisma = new PrismaClient()

export function randomUrl(): string {
	return Math.random().toString(16).slice(2)
}

// gets random time starting from now and
// going back one day whenever you seed the
// database in the future
export function randomDate(): string {
	// this is set to one day
	const offset = 24 * 60 * 60 * 1000 * 1

	const current = new Date().getTime()
	const random = Math.random() * offset
	const difference = new Date(current - random)

	return difference.toISOString()
}

function getUsers() {
	return [
		{
			name: 'matia',
			handle: '@joyofcodedev',
			email: 'matia@example.test',
			avatar: '/profile/matia/avatar.webp',
			about: 'Likes long walks on the beach. 😘',
			tweets: {
				create: [
					{
						url: randomUrl(),
						posted: randomDate(),
						content: `SvelteKit is lit. 🔥`,
						likes: 10
					},
					{
						url: randomUrl(),
						posted: randomDate(),
						content: `I love Svelte! ❤️`,
						likes: 24
					},
					{
						url: randomUrl(),
						posted: randomDate(),
						content: `Sometimes when I'm writing JavaScript I want to throw up my hands and say "this is crazy!" but I can't remember what "this" refers to. 🤪`,
						likes: 0
					},
					{
						url: randomUrl(),
						posted: randomDate(),
						content: `How do you comfort a JavaScript bug? You console it. 🤭`,
						likes: 0
					}
				]
			}
		},
		{
			name: 'bob',
			handle: '@bobross',
			email: 'bob@example.test',
			avatar: '/profile/bob/avatar.webp',
			about: 'Likes painting.',
			tweets: {
				create: [
					{
						url: randomUrl(),
						posted: randomDate(),
						content: `Use your imagination. Wind it up, blend it together. The joy of painting really is universal.`,
						likes: 1
					},
					{
						url: randomUrl(),
						posted: randomDate(),
						content: `The only thing I have control over is taking out the trash. 😂`,
						likes: 4
					},
					{
						url: randomUrl(),
						posted: randomDate(),
						content:
							'Painting is as individual as people are. 👩‍🎨',
						likes: 0
					},
					{
						url: randomUrl(),
						posted: randomDate(),
						content:
							'All we do is just sorta have an idea in our mind, and we just sorta let it happen. 🌈',
						likes: 10
					}
				]
			}
		}
	]
}

async function seed() {
  const users = getUsers()

  for (const user of users) {
    await prisma.user.create({ data: user })
  }
}

seed()
```

Run `npm i -D ts-node @types/node` to install ts-node and transpile ts.	
Go to `package.json` file and edit a new section by adding the Prisma script:
```
{
	"name": "svelt-express-boilerplate",
	"version": "0.0.1",
	"prisma": {
		"seed": "node --loader ts-node/esm ./prisma/seed.ts"
	  },	  
	"private": true,
	"scripts": {
		.....
```
Now run `npx prisma db seed` to seed the base. 

🌱  The seed command has been executed.

Change your `svelt.config.ts` file, to match this new Config set: 
```
const config = {
	preprocess: preprocess(),
	kit: {
		adapter: adapter(),
		alias: {
			$root: 'src'
    }
	}
}
```
## TL;DR Installation

Install my-project with npm

```bash
  edit the installation commands
```
    
## Documentation
[sveltkit](https://kit.svelte.dev/docs/)
[Where i learn it ](https://joyofcode.xyz/sveltekit-for-beginners#introduction)
[_Prisma VS Code Extension_](https://marketplace.visualstudio.com/items?itemName=Prisma.prisma)

