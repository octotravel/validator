# Base
FROM node:22.15.1-alpine3.21 AS base

ARG SENTRY_AUTH_TOKEN

WORKDIR /app

COPY package.json yarn.lock .yarnrc.yml /app
RUN apk add --no-cache git
RUN corepack enable
RUN yarn install --immutable --mode=skip-build

COPY . /app

ENV NODE_ENV=production

RUN yarn run esbuild

# Final
FROM node:22.15.1-alpine3.21 AS final

ENV NODE_ENV=production

WORKDIR /app

COPY --from=base /app/package.json /app/package.json
COPY --from=base /app/src/common/database/migrations /app/src/common/database/migrations
COPY --from=base /app/dist /app/dist

CMD ["node", "--no-warnings", "--max-old-space-size=6144", "/app/dist/server.js"]
