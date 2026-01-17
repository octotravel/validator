FROM denoland/deno:alpine-2.6.5

EXPOSE $APP_PORT

WORKDIR /var/www/backend/

USER deno

RUN deno install

COPY . .

CMD ["run", "--unstable-sloppy-imports", "--allow-net", "--allow-env", "--allow-read", "--allow-sys", "--watch", "src/server.ts"]