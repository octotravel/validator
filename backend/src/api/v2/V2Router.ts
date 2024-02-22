import { Router } from 'itty-router';
import { inject, singleton } from 'tsyringe';
import { CreateSessionHandler } from './session/CreateSessionHandler';
import { UpdateSessionHandler } from './session/UpdateSessionHandler';
import { GetSupplierHandler } from './reseller/octo/supplier/GetSupplierHandler';
@singleton()
export class V2Router {
  public readonly router;

  public constructor(
    @inject(CreateSessionHandler) private readonly createSessionHandler: CreateSessionHandler,
    @inject(UpdateSessionHandler) private readonly updateSessionHandler: UpdateSessionHandler,
    @inject(GetSupplierHandler) private readonly getSupplierHandler: GetSupplierHandler,
  ) {
    this.router = Router({ base: '/v2' });

    this.router.get('/session/:sessionId', async (request) => await this.createSessionHandler.handleRequest(request));
    this.router.post('/session', async (request) => await this.createSessionHandler.handleRequest(request));
    this.router.put('/session/:sessionId', async (request) => await this.updateSessionHandler.handleRequest(request));

    this.router.get('/api/octo/supplier', async (request) => await this.getSupplierHandler.handleRequest(request));
  }
}
