import Router from "npm:@koa/router@^12.0.0";
import { ValidationController } from "../services/validation/Controller.ts";
import { validationConfigSchema, ValidationEndpoint } from "../schemas/Validation.ts";
import { Config } from "../services/validation/config/Config.ts";

export const router = new Router();
router.post("/validate", async (ctx: any, _: any) => {
  // create some init class
  await validationConfigSchema.validate(ctx.request.body);
  const schema = validationConfigSchema.cast(ctx.request.body) as ValidationEndpoint

  const config = Config.getInstance();
  config.init(schema);

  const body = await new ValidationController().validate();

  ctx.status = 200;
  ctx.body = body;
  ctx.toJSON();
});