### 1. Database Configuration

Add the following to your `.env` file:

```env
DATABASE_URL="postgresql://postgres:mypassword@localhost:5432/postgres"
```

### 2. Run PostgreSQL with Docker

```bash
docker run \
-e POSTGRES_PASSWORD=mypassword \
-e POSTGRES_DB=postgres \
-d \
-p 5432:5432 \
--name postgres-db-new \
postgres
```

### 3. Install Dependencies

```bash
bun install
```

### 4. Generate Prisma Client

```bash
bunx prisma generate
```

### 5. Run Database Migrations

```bash
bunx prisma migrate dev --name init
```

### 6. Run the Application

```bash
bun run index.ts
```

### 7. Open Prisma Studio (Optional)

```bash
bunx prisma studio
```

> Having trouble or want to build this from scratch?  
> See **[SETUP.md](./SETUP.md)**