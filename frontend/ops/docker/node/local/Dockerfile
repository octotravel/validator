FROM node:22.15.1-alpine3.21

WORKDIR /var/www/frontend/

RUN apk add --no-cache git

COPY . .

EXPOSE $PUBLIC_APP_PORT

CMD ["sh", "-c", "npm install --silent --no-audit --no-fund --prefer-offline && npm run dev"]
