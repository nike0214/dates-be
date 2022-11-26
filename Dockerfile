## Builder
FROM node:14.19.1 AS builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

## Deploy
FROM node:14.19.1-alpine3.15
WORKDIR /app
COPY --from=builder /app ./
CMD ["npm", "run", "start:dev"]