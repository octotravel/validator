# Base
FROM node:22.15.1-alpine3.21 AS base

ARG SENTRY_AUTH_TOKEN

WORKDIR /app

COPY package*.json /app
RUN npm install --include=dev --silent --no-audit --no-fund --ignore-scripts

COPY . /app

ENV NODE_ENV=production

RUN npm run esbuild

# Final
FROM node:22.15.1-alpine3.21 AS final

ENV NODE_ENV=production

WORKDIR /app

COPY --from=base /app/package.json /app/package.json
COPY --from=base /app/src/common/database/migrations /app/src/common/database/migrations
COPY --from=base /app/dist /app/dist

CMD ["node", "--no-warnings", "--max-old-space-size=6144", "/app/dist/server.js"]
