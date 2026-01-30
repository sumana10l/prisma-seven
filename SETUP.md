# hello-prisma

A minimal Prisma + PostgreSQL setup using **TypeScript**, **tsx**, and **Docker**.

---

## Prerequisites

* Node.js (v18+ recommended)
* Docker
* npm

---

## Project Setup

### 1. Initialize Project

```bash
mkdir hello-prisma
cd hello-prisma
npm init -y
```

### 2. Install Dependencies

```bash
npm install typescript tsx @types/node --save-dev
npx tsc --init

npm install prisma @types/node @types/pg --save-dev
npm install @prisma/client @prisma/adapter-pg pg dotenv
```

---

## Configuration

### `tsconfig.json`

```json
{
  "compilerOptions": {
    "module": "ESNext",
    "moduleResolution": "bundler",
    "target": "ES2023",
    "strict": true,
    "esModuleInterop": true,
    "ignoreDeprecations": "6.0"
  }
}
```

### `package.json`

```json
{
  "type": "module",
  "scripts": {
    "dev": "tsx script.ts"
  }
}
```

---

## Prisma Setup

### Initialize Prisma

```bash
npx prisma init
```

### `prisma.config.ts`

```ts
import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
})
```

### Environment Variables

Create `.env`:

```env
DATABASE_URL="postgresql://postgres:mypassword@localhost:5432/postgres"
```

---

## Database (Docker)

```bash
docker run -e POSTGRES_PASSWORD=mypassword \
-e POSTGRES_DB=mydb \
-d -p 5432:5432 \
--name postgres-db-new \
postgres
```

---

## Prisma Schema

Update `prisma/schema.prisma` with your models.

---

## Migrations & Client

```bash
npx prisma migrate dev --name init
npx prisma generate
```

---

## Prisma Client Setup

### `lib/prisma.ts`

```ts
import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../generated/prisma/client'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
})

export const prisma = new PrismaClient({ adapter })
```

---

## Example Script

### `script.ts`

```ts
import { prisma } from './lib/prisma'

async function main() {
  const user = await prisma.user.create({
    data: {
      name: 'Alice',
      email: `alice${Date.now()}@prisma.io`,
      posts: {
        create: {
          title: 'Hello World',
          content: 'This is my first post!',
          published: true,
        },
      },
    },
    include: { posts: true },
  })

  console.log('Created user:', user)

  const allUsers = await prisma.user.findMany({
    include: { posts: true },
  })

  console.log('All users:', JSON.stringify(allUsers, null, 2))
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
```

---

## Run the App

```bash
npm run dev
```

---


