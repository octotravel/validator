import { Router } from 'itty-router';
import { inject, singleton } from 'tsyringe';
import { ValidateHandler } from './validate/ValidateHandler';

@singleton()
export class V1Router {
  public readonly router;

  public constructor(@inject(ValidateHandler) private readonly validateHandler: ValidateHandler) {
    this.router = Router({ base: '/v1' });
    this.router.post('/validate', async (request) => await this.validateHandler.handleRequest(request));
  }
}
