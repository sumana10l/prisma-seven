# hello-prisma

A minimal Prisma + PostgreSQL + Express setup using **TypeScript**, **tsx**, and **Docker**.

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
npm install typescript tsx @types/node @types/express express --save-dev
npx tsc --init

npm install prisma @types/node @types/pg --save-dev
npm install @prisma/client @prisma/adapter-pg pg dotenv express
```
---

## Configuration

### `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "es2022",
    "module": "esnext",
    "moduleResolution": "node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}
```

Update your `package.json` scripts:

```json
"scripts": {
  "dev": "tsx watch server.ts"
}
```

---

## Prisma Setup

### Initialize Prisma

```bash
npx prisma init
```

### Environment Variables

Create `.env`:

```env
DATABASE_URL="postgresql://postgres:mypassword@localhost:5432/mydb"
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

`prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id          Int      @id @default(autoincrement())
  username    String?
  password    String?
  name        String?
  email       String   @unique
  travelPlans TravelPlan[]
}

model TravelPlan {
  id                  Int     @id @default(autoincrement())
  userId              Int
  user                User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  title               String
  destinationCity     String
  destinationCountry  String
  startDate           DateTime
  endDate             DateTime
  budget              Int?
}
```

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
import { PrismaClient } from '@prisma/client'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
})

export const prisma = new PrismaClient({ adapter })
```

---

## Express Server

### Create `server.ts`

Create a new file `server.ts` with an Express app that:
- Listens on port 3000
- Implements CRUD routes for Users and Travel Plans
- Uses Prisma client to interact with the database

See the [server.ts example](./server.ts) for full implementation.

---

## Run the Server

```bash
npm run dev
```

Server starts on `http://localhost:3000`

## Testing

### Create `test-api.sh`

Create a bash script that tests all API endpoints using `curl`:

See the [test-api.sh example](./test-api.sh) for full script.


### Run Tests

```bash
chmod +x test-api.sh
./test-api.sh
```

**Make sure the server is running** in another terminal (`npm run dev`) before running tests.

---