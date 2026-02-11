# DOCKERFILE FOR PRODUCTION

FROM node:20-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm

# Copy package.json and package-lock.json
COPY package*.json pnpm-lock.yaml ./
RUN pnpm install

# Copy source code to /app
COPY . .
RUN pnpm run build

FROM node:20 AS runner

WORKDIR /app

RUN npm install -g pnpm

COPY --from=builder /app/dist ./dist
COPY package*.json pnpm-lock.yaml ./

RUN pnpm install --prod
EXPOSE 3000

CMD ["node", "dist/main"]

#improve jadi multistage dengan nerapin node:20 AS runner
