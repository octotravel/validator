FROM node:24.11-alpine3.21 AS base

WORKDIR /app

COPY . .

ENV NODE_ENV=production
ENV PUBLIC_VALIDATOR_BASE_URL=https://validator-backend.octo.travel

RUN npm install
RUN npm run build

EXPOSE $PUBLIC_APP_PORT

RUN npm update --global npm
RUN npm install --global

CMD ["node", "build/index.js"]
