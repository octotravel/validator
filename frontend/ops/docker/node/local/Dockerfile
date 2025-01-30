FROM node:22.9.0-alpine3.20

RUN apk add --no-cache libc6-compat wget git ansible

WORKDIR /var/www/frontend/

RUN apk add --no-cache git

COPY . .

EXPOSE $PUBLIC_APP_PORT

RUN npm update --global npm
RUN npm install --global

CMD ["sh", "-c", "npm install --no-lockfile --prefer-offline && npm run dev"]