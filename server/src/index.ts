import { Config } from './services/validation/config/Config.ts';
import { validationConfigSchema } from './schemas/Validation.ts';
import { ValidationController } from './services/validation/Controller.ts';
import { ValidationError } from "https://esm.sh/yup@0.32.11";
import { serve } from "https://deno.land/std@0.160.0/http/server.ts";
import {
  OctoError,
  InternalServerError,
  BadRequestError,
} from "./models/Error.ts";

serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 400 });
  }
  try {
    const reqBody = await req.json();
    await validationConfigSchema.validate(reqBody);
    const schema = validationConfigSchema.cast(reqBody)
    const config = Config.getInstance();
    config.init(schema);
    const body = await new ValidationController().validate();

    return new Response(JSON.stringify(body), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (e) {
    const err = e as Error
    if (err instanceof OctoError) {
      return new Response(JSON.stringify(err.body), {
        status: err.status,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } else if (err instanceof ValidationError) {
      const error = new BadRequestError(err.message);
      return new Response(JSON.stringify(error.body), {
        status: error.status,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } else {
      const error = new InternalServerError(err.message);
      return new Response(JSON.stringify(error.body), {
        status: error.status,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
  }
}, { port: 3000 });