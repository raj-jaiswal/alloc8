# room-allocation

## Client : React + Tailwind

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

Create a `server/.env` file containing the following:
```sh
DATABASE_URL="mongodb+srv://<username>:<password>@<connection_url>/<database_name>"
AUDIENCE="<application_id>"
```

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


## NGINX Config for deploying server
```
limit_req_zone $binary_remote_addr zone=ip:10m rate=5r/s;

server {
    http2 on;
    server_name api.alloc8.in;
    location / {
            limit_req zone=ip burst=12 delay=8;
            proxy_pass http://localhost:8500;
    }
}
```

## .env for deploying client
```
VITE_SERVER_URL="https://api.alloc8.in"
```
