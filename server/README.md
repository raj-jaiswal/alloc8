## Installation And Usage

```bash
npm install
```

Create `.env` file with mongodb db url (`<connectionString>/<dbName>` if you're using mongodb local install)
then run

to run redis
```bash
#install
docker run -d --name redis-stack -p 6379:6379 -p 8001:8001 redis/redis-stack:latest
# connect
docker exec -it redis-stack redis-cli

```

```bash
npx prisma generate
```

Whenever you update your Prisma schema, you will need to run

```bash
npx prisma db push
node prisma/seed.js
```

then

```bash
npm start
```
