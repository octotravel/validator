import "isomorphic-fetch";
import Koa from "koa";
import koaBody from "koa-body";
import cors from "@koa/cors";
import serve from "koa-static";
import mount from 'koa-mount'
import { router } from "./router/AppRouter";
import { ValidationError } from "yup";
import {
  OctoError,
  InternalServerError,
  BadRequestError,
} from "./models/Error";

const app = new Koa();

app.use(mount("/", serve("./../client/build")));

app.use(cors());
app.use(koaBody());
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (e) {
    const err = e as Error
    if (err instanceof OctoError) {
      ctx.status = err.status;
      ctx.body = err.body;
    } else if (err instanceof ValidationError) {
      const error = new BadRequestError(err.message);
      ctx.status = error.status;
      ctx.body = error.body;
    } else {
      const error = new InternalServerError(err.message);
      ctx.status = error.status;
      ctx.body = {
        ...error.body,
        stack: error.stack,
      };
    }
  }
});
app.use(router.routes());

app.listen(3000);
