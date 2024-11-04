import { Router } from 'itty-router';

import { OctoRouter } from './octo/OctoRouter';
import { GetScenariosHandler } from './scenario/GetScenariosHandler';
import { GetCapabilitiesHandler } from './capabilities/GetCapabilitiesHandler';
import { GetScenarioHandler } from './scenario/GetScenarioHandler';
import { inject } from '@needle-di/core';

export class ResellerRouter {
  public readonly router;

  public constructor(
    private readonly octoRouter: OctoRouter = inject(OctoRouter),
    private readonly getCapabilitiesHandler: GetCapabilitiesHandler = inject(GetCapabilitiesHandler),
    private readonly getScenariosHandler: GetScenariosHandler = inject(GetScenariosHandler),
    private readonly getScenarioHandler: GetScenarioHandler = inject(GetScenarioHandler),
  ) {
    this.router = Router({ base: '/v2/reseller' });

    this.router.get('/capabilities', async (request) => await this.getCapabilitiesHandler.handleRequest(request));
    this.router.get('/scenarios', async (request) => await this.getScenariosHandler.handleRequest(request));
    this.router.get('/scenarios/:scenarioId', async (request) => await this.getScenarioHandler.handleRequest(request));

    this.router.all('/octo/*', this.octoRouter.router.fetch);
  }
}
