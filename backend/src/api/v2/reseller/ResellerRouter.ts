import { Router } from 'itty-router';
import { inject, singleton } from 'tsyringe';
import { OctoRouter } from './octo/OctoRouter';
import { GetScenariosHandler } from './scenario/GetScenariosHandler';
import { GetCapabilitiesHandler } from './capabilities/GetCapabilitiesHandler';

@singleton()
export class ResellerRouter {
  public readonly router;

  public constructor(
    @inject(OctoRouter) private readonly octoRouter: OctoRouter,
    @inject(GetCapabilitiesHandler) private readonly getCapabilitiesHandler: GetCapabilitiesHandler,
    @inject(GetScenariosHandler) private readonly getScenariosHandler: GetScenariosHandler,
  ) {
    this.router = Router({ base: '/v2/reseller' });

    this.router.get('/capabilities', async (request) => await this.getCapabilitiesHandler.handleRequest(request));
    this.router.get('/scenarios', async (request) => await this.getScenariosHandler.handleRequest(request));

    this.router.all('/octo/*', this.octoRouter.router.handle);
  }
}