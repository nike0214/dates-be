## Builder
FROM node:14.19.1 AS builder
WORKDIR /app
COPY . .
RUN npm install

## Deploy
FROM node:14.19.1-alpine3.15
WORKDIR /app
COPY --from=builder /app ./
RUN npm install sqlite3 --save
CMD ["npm", "run", "start:dev"]