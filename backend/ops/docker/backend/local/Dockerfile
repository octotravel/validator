FROM denoland/deno:2.2.8

EXPOSE $APP_PORT

WORKDIR /app

USER deno

RUN deno install

COPY . .

CMD ["run", "--unstable-sloppy-imports", "--allow-net", "--allow-env", "--allow-read", "--allow-sys", "--watch", "src/server.ts"]