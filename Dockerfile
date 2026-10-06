# syntax=docker/dockerfile:1

ARG NODE_VERSION=22.21.0

FROM node:${NODE_VERSION}-alpine AS base
RUN corepack enable
WORKDIR /app

# --- Build stage: install all dependencies and compile TypeScript
FROM base AS build
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --ignore-scripts
COPY tsconfig.json ./
COPY src ./src
RUN pnpm run build

# --- Production dependencies only
FROM base AS prod-deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod --ignore-scripts

# --- Runtime image
FROM node:${NODE_VERSION}-alpine AS runtime
ENV NODE_ENV=production \
    JSON_STORAGE_PATH=/app/data/storage.json
WORKDIR /app

COPY --chown=node:node package.json ./
COPY --chown=node:node --from=prod-deps /app/node_modules ./node_modules
COPY --chown=node:node --from=build /app/dist ./dist
RUN mkdir -p /app/data && chown node:node /app/data

USER node
VOLUME ["/app/data"]

CMD ["node", "dist/index.js"]
