import "npm:isomorphic-fetch";
import Koa from "npm:koa";
import koaBody from "npm:koa-body";
import cors from "npm:@koa/cors";
import serve from "npm:koa-static";
import mount from 'npm:koa-mount'
import { router } from "./router/AppRouter.ts";
import { ValidationError } from "npm:yup@^0.32.11";
import {
  OctoError,
  InternalServerError,
  BadRequestError,
} from "./models/Error.ts";

const app = new Koa();

app.use(mount("/", serve("./../client/build")));

app.use(cors());
app.use(koaBody.koaBody());
app.use(async (ctx: any, next: any) => {
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

app.listen(3001);
