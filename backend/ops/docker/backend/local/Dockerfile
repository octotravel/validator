FROM node:20.9-alpine3.17

RUN apk add --no-cache libc6-compat wget git ansible make build-base

WORKDIR /var/www/backend/

RUN apk add --no-cache git

COPY . .

EXPOSE $APP_PORT

RUN npm update --global npm

CMD ["sh", "-c", "npm install --no-lockfile --prefer-offline && npm run dev"]