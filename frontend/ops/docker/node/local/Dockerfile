FROM node:20.9-alpine3.17

RUN apk add --no-cache libc6-compat wget git ansible

WORKDIR /var/www/node/

RUN apk add --no-cache git

COPY . .

EXPOSE $APP_PORT

RUN npm update --global npm
RUN npm install --global

CMD ["sh", "-c", "npm install --no-lockfile --prefer-offline && npm run dev"]