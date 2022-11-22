import Router from "@koa/router";
import { ValidationController } from "../services/validation/Controller";
import { validationConfigSchema, ValidationEndpoint } from "../schemas/Validation";
import { Config } from "../services/validation/config/Config";
import { createReadStream } from 'fs';

export const router = new Router();
router.post("/validate", async (ctx, _) => {
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

router.get("/", (ctx, _) => {
  ctx.type = 'html';
  ctx.body = createReadStream('./client/build/index.html');
})