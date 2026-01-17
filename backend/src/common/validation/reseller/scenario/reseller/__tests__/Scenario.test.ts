import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import {
  GetScenariosResponse,
  GetScenariosScenarioResponse,
} from '../../../../../../api/reseller/reseller/scenario/GetScenariosResponse';
import { SessionResponse } from '../../../../../../api/reseller/session/SessionResponse';
import { app } from '../../../../../../app';
import { Database } from '../../../../../database/Database';
import { container } from '../../../../../di/container';
import { ScenarioId } from '../../ScenarioId';
import { ScenarioRepository } from '../../ScenarioRepository';
import { CoreScenario } from '../CoreScenario';
import { ScenarioStepTestUtil } from './ScenarioStepTestUtil';

describe('CoreScenario', () => {
  const server = app.listen();
  const targetScenarioId = ScenarioId.ADVANCED_SCENARIO;
  const targetScenario = container.get(CoreScenario);
  let headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  let database: Database;
  let scenarioRepository: ScenarioRepository;
  let sessionId: string;
  let scenarioStepTestUtil: ScenarioStepTestUtil;

  beforeAll(async () => {
    database = container.get('Database');

    // Fetch scenarios
    const scenariosResponse = await request(server).get('/v2/reseller/scenarios').set(headers).send();
    const scenariosBody = scenariosResponse.body as GetScenariosResponse;
    const scenarioInfo = scenariosBody.find(
      (scenario: GetScenariosScenarioResponse) => scenario.id === targetScenarioId,
    )!;

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

    headers = {
      ...headers,
      Authorization: `Bearer ${sessionId}`,
      'Octo-Capabilities': capabilities.join(','),
    };

    scenarioStepTestUtil = new ScenarioStepTestUtil(server, headers, targetScenario, sessionId);
  });

  describe('Should test all scenarios', async () => {
    scenarioRepository = container.get('ScenarioRepository');
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
      await database.query('DELETE FROM reseller_request_log');
      await database.query('DELETE FROM session');
    });
  });

  describe('CoreScenarioReseller', () => {
    const server = app.listen();
    const targetScenarioId = ScenarioId.ADVANCED_SCENARIO;
    const targetScenario = container.get(CoreScenario);
    let headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    let database: Database;
    let scenarioRepository: ScenarioRepository;
    let sessionId: string;
    let scenarioStepTestUtil: ScenarioStepTestUtil;

    beforeAll(async () => {
      database = container.get('Database');

      // Fetch scenarios
      const scenariosResponse = await request(server).get('/reseller/scenarios').set(headers).send();
      const scenariosBody = scenariosResponse.body as GetScenariosResponse;
      const scenarioInfo = scenariosBody.find(
        (scenario: GetScenariosScenarioResponse) => scenario.id === targetScenarioId,
      )!;

      // Prepare session
      const createSessionResponse = await request(server).post('/reseller/session').set(headers).send();
      expect(createSessionResponse.status).toBe(200);
      const sessionResponse = createSessionResponse.body as SessionResponse;
      sessionId = sessionResponse.id;

      const capabilities = scenarioInfo.requiredCapabilities.concat(scenarioInfo.optionalCapabilities);
      await request(server).put(`/reseller/session/${sessionId}`).set(headers).send({
        capabilities: capabilities,
        currentScenario: scenarioInfo.id,
      });

      headers = {
        ...headers,
        Authorization: `Bearer ${sessionId}`,
        'Octo-Capabilities': capabilities.join(','),
      };

      scenarioStepTestUtil = new ScenarioStepTestUtil(server, headers, targetScenario, sessionId);
    });

    describe('Should test all scenarios', async () => {
      scenarioRepository = container.get('ScenarioRepository');
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
        await database.query('DELETE FROM reseller_request_log');
        await database.query('DELETE FROM session');
      });
    });
  });
});
