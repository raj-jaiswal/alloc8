# room-allocation

## client : React + tailwind

Register an application at Microsoft Azure Portal and put the configuration at client/src/authConfig.js
To run a development server at http://localhost:5173/:

```sh
cd client/
npm install
npm run dev
```

Deploy with:

```sh
cd client/
netlify deploy --prod
```

## Backend : Express

To run a development server at http://localhost:8800/:

```sh
cd server/
npm install
npm run start
```

Deploy with:

```sh
cd server/
pm2 start index.js
```

## DB : Prisma

After changes to the schema:
```sh
npx prisma generate
```
