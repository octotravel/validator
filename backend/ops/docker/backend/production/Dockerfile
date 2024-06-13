FROM node:20.9-alpine3.17 as builder

WORKDIR /app

RUN apk add --no-cache libc6-compat wget git ansible make build-base
RUN npm install --global npm node-gyp esbuild

COPY package.json /app/
RUN npm install --no-lockfile

ARG SENTRY_AUTH_TOKEN
ARG NODE_ENV

COPY . /app/
RUN npm run esbuild

CMD ["/bin/sh", "-c", "ansible-vault decrypt .env.prod --output=.env --vault-password-file=/secrets/.ansible-password && node --max-old-space-size=6144 /app/dist/server.js"]
