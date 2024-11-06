FROM node:22.9.0-alpine3.19

RUN apk add --no-cache libc6-compat wget git ansible make build-base

WORKDIR /var/www/backend/

RUN apk add --no-cache git

COPY . .

EXPOSE $APP_PORT

RUN npm update --global npm
RUN npm install --global concurrently node-gyp

CMD ["sh", "-c", "npm install --no-lockfile --prefer-offline && npm run dev"]
