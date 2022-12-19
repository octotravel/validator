import { Config } from './services/validation/config/Config.ts';
import { validationConfigSchema } from './schemas/Validation.ts';
import { ValidationController } from './services/validation/Controller.ts';
import { ValidationError } from "https://esm.sh/yup@0.32.11";
import {
  OctoError,
  InternalServerError,
  BadRequestError,
} from "./models/Error.ts";
import { Application, Router, send } from "https://deno.land/x/oak/mod.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";

const router = new Router();
router
  .post("/validate", async (ctx) => {
    try {
      console.log('fap')
      console.log(ctx.request)
      const reqBody = await ctx.request.body().value;
      await validationConfigSchema.validate(reqBody);
      const schema = validationConfigSchema.cast(reqBody)
      const config = Config.getInstance();
      config.init(schema);
      const body = await new ValidationController().validate();


      ctx.response.body = body;
      ctx.response.type = "json";
      ctx.response.status = 200;
    } catch (e) {
      const err = e as Error
      if (err instanceof OctoError) {
        ctx.response.body = err.body;
        ctx.response.type = "json";
        ctx.response.status = err.status;
      } else if (err instanceof ValidationError) {
        const error = new BadRequestError(err.message);
        ctx.response.body = error.body;
        ctx.response.type = "json";
        ctx.response.status = error.status;
      } else {
        const error = new InternalServerError(err.message);
        ctx.response.body = error.body;
        ctx.response.type = "json";
        ctx.response.status = error.status;
      }
    }
  })

const app = new Application();
app.use(oakCors()); // Enable CORS for All Routes
app.use(router.routes());

await app.listen({ port: 3000 });