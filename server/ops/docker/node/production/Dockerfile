FROM node:18.7.0-alpine3.15

WORKDIR /var/www/server/

COPY . .

RUN apk add --update --no-cache python3 build-base gcc && ln -sf /usr/bin/python3 /usr/bin/python
RUN npm install

ENV NODE_ENV=production

RUN npm run build

EXPOSE $PORT

RUN chown -R node /var/www/server

USER node

RUN ls -la

CMD ["node", "./dist/index.js"]
