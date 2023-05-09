import { validationConfigSchema, ValidationEndpoint } from './schemas/Validation.ts';
import { ValidationController } from './services/validation/Controller.ts';
import { ValidationError } from "https://esm.sh/yup@0.32.11";
import {
  OctoError,
  InternalServerError,
  BadRequestError,
} from "./models/Error.ts";
import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";
import { Context } from "./services/validation/context/Context.ts";
import { SupabaseLogger } from './services/logging/Logger.ts';

const router = new Router();
const logger = new SupabaseLogger();

router
  .post("/validate", async (ctx) => {
    const context = new Context();
    try {
      const urlParams = ctx.request.url.searchParams;
      const endpointParam = urlParams.get("endpoint");
      const apiKeyParam = urlParams.get("apiKey");

      if (endpointParam && apiKeyParam) {
        const schema = validationConfigSchema.cast({
          backend: {
            endpoint: endpointParam,
            apiKey: apiKeyParam,
          },
        }) as ValidationEndpoint;
        context.setSchema(schema);
      } else {
        const reqBody = await ctx.request.body().value;
        await validationConfigSchema.validate(reqBody);
        const schema = validationConfigSchema.cast(reqBody) as ValidationEndpoint;
        context.setSchema(schema);
      }
      const body = await new ValidationController().validate(context);

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
    logger.logRequest(ctx.request, ctx.response, context);
  })
const app = new Application();
app.use(oakCors()); // Enable CORS for All Routes
app.use(router.routes());

await app.listen({ port: 3000 });