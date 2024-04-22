FROM node:20.9-alpine3.17

WORKDIR /app

COPY . .

RUN npm install
RUN npm run build

EXPOSE $PUBLIC_APP_PORT
CMD ["node","build/index.js"]