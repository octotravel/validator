import { Router } from 'itty-router';
import { inject, singleton } from 'tsyringe';
import { CreateSessionHandler } from './session/CreateSessionHandler';
import { UpdateSessionHandler } from './session/UpdateSessionHandler';
import { GetSessionHandler } from './session/GetSessionHandler';
import { ResellerRouter } from './reseller/ResellerRouter';
import { GetSessionValidationHistoryHandler } from './session/GetSessionValidationHistoryHandler';

@singleton()
export class V2Router {
  public readonly router;

  public constructor(
    @inject(CreateSessionHandler) private readonly createSessionHandler: CreateSessionHandler,
    @inject(GetSessionHandler) private readonly getSessionHandler: GetSessionHandler,
    @inject(UpdateSessionHandler) private readonly updateSessionHandler: UpdateSessionHandler,
    @inject(GetSessionValidationHistoryHandler) private readonly getSessionValidationHistoryHandler: GetSessionValidationHistoryHandler,
    @inject(ResellerRouter) private readonly resellerRouter: ResellerRouter,
  ) {
    this.router = Router({ base: '/v2' });

    this.router.get('/session/:sessionId', async (request) => await this.getSessionHandler.handleRequest(request));
    this.router.post('/session', async (request) => await this.createSessionHandler.handleRequest(request));
    this.router.put('/session/:sessionId', async (request) => await this.updateSessionHandler.handleRequest(request));
    this.router.get(
      '/session/:sessionId/validation-history/:scenarioId',
      async (request) => await this.getSessionValidationHistoryHandler.handleRequest(request),
    );

    this.router.all('/reseller/*', this.resellerRouter.router.fetch);
  }
}
