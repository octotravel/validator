FROM node:20.9-alpine3.17

RUN apk add --no-cache libc6-compat wget git ansible make build-base

WORKDIR /var/www/backend/

COPY package.json .
COPY package-lock.json .
RUN npm install --silent --no-audit --no-lockfile --prefer-offline --legacy-peer-deps

COPY . .

EXPOSE $APP_PORT

CMD ["npm", "run", "dev", "--silent"]