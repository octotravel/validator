import { inject } from '@needle-di/core';
import { Router } from 'itty-router';
import { GetCapabilitiesHandler } from '../reseller/reseller/capabilities/GetCapabilitiesHandler';
import { GetScenarioHandler } from '../reseller/reseller/scenario/GetScenarioHandler';
import { GetScenariosHandler } from '../reseller/reseller/scenario/GetScenariosHandler';
import { V2OctoRouter } from './V2OctoRouter';

export class V2RootRouter {
  public readonly router;

  public constructor(
    private readonly octoRouter = inject(V2OctoRouter),
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
