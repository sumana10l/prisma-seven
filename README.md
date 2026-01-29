### 1. Database Configuration

Add the following to your `.env` file:

```
DATABASE_URL="postgresql://postgres:mypassword@localhost:5432/postgres"
```

### 2. Run PostgreSQL with Docker

```
docker run -e POSTGRES_PASSWORD=mypassword \
-e POSTGRES_DB=mydb \
-d -p 5432:5432 \
--name postgres-db-new \
postgres
```

### 3. Install Dependencies

```
npm install
```

### 4. Generate Prisma Client

```
npx prisma generate
```

### 5. Run Database Migrations

```
npx prisma migrate dev --name init
```

### 6. Run the Script

```
npx tsx script.ts
```


