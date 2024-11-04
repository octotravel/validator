FROM node:22.11.0-alpine3.19 as builder

WORKDIR /app

RUN apk add --no-cache libc6-compat wget git ansible make build-base
RUN npm install --global npm node-gyp esbuild

COPY package.json /app/
RUN npm install --no-lockfile

ARG SENTRY_AUTH_TOKEN
ARG NODE_ENV

COPY . /app/
RUN npm run esbuild

CMD ["/bin/sh", "-c", "node --max-old-space-size=6144 /app/dist/server.js"]
