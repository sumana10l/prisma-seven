# bun-prisma

A minimal **Bun + Prisma + PostgreSQL** setup using **TypeScript** and **Docker**.

---

## Prerequisites

- Bun
- Docker
- PostgreSQL (via Docker)

---

## Project Setup

### 1. Initialize Project

```bash
mkdir bun-prisma
cd bun-prisma

bun init
```

### 2. Install Dependencies

```bash
# Development dependencies
bun add prisma @types/pg --dev

# Runtime dependencies
bun add @prisma/client @prisma/adapter-pg pg
```

---

## Prisma Setup

### Initialize Prisma

```bash
bunx --bun prisma init
```

---

## Environment Variables

Create a `.env` file.

```env
DATABASE_URL="postgresql://postgres:mypassword@localhost:5432/postgres"
```

---

## Database (Docker)

```bash
docker run \
-e POSTGRES_PASSWORD=mypassword \
-e POSTGRES_DB=postgres \
-d \
-p 5432:5432 \
--name postgres-db-new \
postgres
```

---

## Prisma Configuration

### `prisma.config.ts`

```ts
import { defineConfig, env } from "prisma/config";
import "dotenv/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
```

---

## Prisma Schema

Update `prisma/schema.prisma`.

```prisma
generator client {
  provider = "prisma-client"
  output   = "../generated/prisma"
}

datasource db {
  provider = "postgresql"
}

model User {
  id    Int    @id @default(autoincrement())
  email String @unique
  name  String?
}
```

---

## Generate Migration & Client

```bash
bunx prisma migrate dev --name init

bunx prisma generate
```

---

## Prisma Client Setup

Create `lib/prisma.ts`.

```ts
import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

export const prisma = new PrismaClient({
  adapter,
});
```

---

## Example Script

### `index.ts`

```ts
import { prisma } from "./lib/prisma";

const server = Bun.serve({
  port: 3000,

  async fetch(req) {
    const { pathname } = new URL(req.url);

    if (pathname === "/favicon.ico") {
      return new Response(null, { status: 204 });
    }

    if (pathname === "/") {
      // Insert sample user
      const newUser = await prisma.user.create({
        data: {
          name: "John Doe",
          email: `john${Date.now()}@example.com`,
        },
      });

      // Fetch all users
      const users = await prisma.user.findMany();

      return Response.json({
        message: "User inserted successfully!",
        insertedUser: newUser,
        totalUsers: users.length,
        users,
      });
    }

    return new Response("Not Found", { status: 404 });
  },
});

console.log(`Listening on http://localhost:${server.port}`);
```

---

## Run the Application

```bash
bun run index.ts
```

---

## Open Prisma Studio

```bash
bunx prisma studio
```

---

## Project Structure

```text
bun-prisma/
│
├── generated/
│   └── prisma/
│
├── prisma/
│   ├── migrations/
│   └── schema.prisma
│
├── lib/
│   └── prisma.ts
│
├── index.ts
├── prisma.config.ts
├── package.json
├── bun.lock
└── .env
```