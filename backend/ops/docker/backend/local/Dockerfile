FROM node:24.11-alpine3.21

WORKDIR /var/www/backend/

RUN apk add --no-cache git
RUN corepack enable

COPY . .

EXPOSE $APP_PORT

CMD ["sh", "-c", "yarn install --silent --immutable --mode=skip-build && yarn run esbuild && yarn run dev"]