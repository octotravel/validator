import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import { app } from '../../../../../../app';
import { Database } from '../../../../../database/Database';
import { SessionResponse } from '../../../../../../api/v2/session/SessionResponse';
import { ScenarioId } from '../../ScenarioId';
import { container, SCENARIO_REPOSITORY } from '../../../../../di/container';
import { GetScenariosResponse } from '../../../../../../api/v2/reseller/scenario/GetScenariosResponse';
import { AdvancedScenario } from '../AdvancedScenario';
import { ScenarioStepTestUtil } from './ScenarioStepTestUtil';
import { ScenarioRepository } from '../../ScenarioRepository';

describe('AdvancedScenario', () => {
  const server = app.listen();
  const targetScenarioId = ScenarioId.ADVANCED_SCENARIO;
  const targetScenario = container.get(AdvancedScenario);
  const headers: any = {
    'Content-Type': 'application/json',
  };
  let database: Database;
  let scenarioRepository: ScenarioRepository;
  let sessionId: string;
  let scenarioStepTestUtil: ScenarioStepTestUtil;

  beforeAll(async () => {
    database = container.get(Database);

    // Fetch scenarios
    const scenariosResponse = await request(server).get('/v2/reseller/scenarios').set(headers).send();
    const scenariosBody = scenariosResponse.body as GetScenariosResponse;
    const scenarioInfo = scenariosBody.find((scenario) => scenario.id === targetScenarioId)!;

    // Prepare session
    const createSessionResponse = await request(server).post('/v2/session').set(headers).send();
    expect(createSessionResponse.status).toBe(200);
    const sessionResponse = createSessionResponse.body as SessionResponse;
    sessionId = sessionResponse.id;

    const capabilities = scenarioInfo.requiredCapabilities.concat(scenarioInfo.optionalCapabilities);
    await request(server).put(`/v2/session/${sessionId}`).set(headers).send({
      capabilities: capabilities,
      currentScenario: scenarioInfo.id,
    });

    headers.Authorization = `Bearer ${sessionId}`;
    headers['Octo-Capabilities'] = capabilities;

    scenarioStepTestUtil = new ScenarioStepTestUtil(server, headers, targetScenario, sessionId);
  });

  describe('Should test all scenarios', async () => {
    scenarioRepository = container.get(SCENARIO_REPOSITORY);
    const scenarios = await scenarioRepository.getAllResellerScenarios();

    for (const scenario of scenarios) {
      describe(`${scenario.getName()} (${scenario.getId()})`, async () => {
        for (const step of scenario.getSteps()) {
          it(`${step.getName()} (${step.getId()})`, async () => {
            await scenarioStepTestUtil.callAndCheckStep(step.getId());
          });
        }
      });
    }
  });

  afterAll(async () => {
    server.close(async () => {
      await database.getConnection().query('DELETE FROM request_log');
      await database.getConnection().query('DELETE FROM session');
    });
  });
});
