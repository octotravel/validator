FROM node:22.9.0-alpine3.20

WORKDIR /app

COPY . .

RUN npm install
RUN npm run build

EXPOSE $PUBLIC_APP_PORT
CMD ["node","build/index.js"]