import { Router } from 'itty-router';

import { inject } from '@needle-di/core';
import { GetCapabilitiesHandler } from './capabilities/GetCapabilitiesHandler';
import { OctoRouter } from './octo/OctoRouter';
import { GetScenarioHandler } from './scenario/GetScenarioHandler';
import { GetScenariosHandler } from './scenario/GetScenariosHandler';

export class ResellerRouter {
  public readonly router;

  public constructor(
    private readonly octoRouter = inject(OctoRouter),
    private readonly getCapabilitiesHandler = inject(GetCapabilitiesHandler),
    private readonly getScenariosHandler = inject(GetScenariosHandler),
    private readonly getScenarioHandler = inject(GetScenarioHandler),
  ) {
    this.router = Router({ base: '/v2/reseller' });

    this.router.get('/capabilities', async (request) => await this.getCapabilitiesHandler.handleRequest(request));
    this.router.get('/scenarios', async (request) => await this.getScenariosHandler.handleRequest(request));
    this.router.get('/scenarios/:scenarioId', async (request) => await this.getScenarioHandler.handleRequest(request));

    this.router.all('/octo/*', this.octoRouter.router.fetch);
  }
}
