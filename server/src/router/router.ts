import Koa from "koa";
import Router from "@koa/router";
import { Context } from '../services/validation/context/Context';
import { validationConfigSchema, ValidationEndpoint } from '../schemas/Validation';
import { ValidationController } from '../services/validation/Controller';
import { OctoError, BadRequestError, InternalServerError } from '../models/Error';
import { SupabaseLogger } from '../services/logging/Logger';
import { ValidationError } from "yup";

export const router = new Router();
const logger = new SupabaseLogger();

router
  .post("/validate", async (ctx: Koa.Context) => {
    const context = new Context();
    try {
      const reqBody = await ctx.request.body;
      await validationConfigSchema.validate(reqBody);
      const schema = validationConfigSchema.cast(reqBody) as ValidationEndpoint;
      context.setSchema(schema);
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
  });