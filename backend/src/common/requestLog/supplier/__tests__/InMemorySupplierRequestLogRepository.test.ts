import { beforeEach, describe, expect, it } from 'vitest';
import { DeepMockProxy, mockDeep } from 'vitest-mock-extended';
import { Context } from '../../../validation/supplier/services/validation/context/Context';
import { ScenarioResult, ValidationResult } from '../../../validation/supplier/services/validation/Scenarios/Scenario';
import { InMemorySupplierRequestLogRepository } from '../InMemorySupplierRequestLogRepository';

class TestableInMemorySupplierRequestLogRepository extends InMemorySupplierRequestLogRepository {
  public getLogs() {
    return this.logs;
  }
}

describe('InMemorySupplierRequestLogRepository', () => {
  let repository: TestableInMemorySupplierRequestLogRepository;
  let scenarioResult: DeepMockProxy<ScenarioResult>;
  let context: DeepMockProxy<Context>;
  const testRequestId = 'test-request-id';
  const testValidationRunId = 'test-validation-run-id';
  const testDuration = 150;

  beforeEach(() => {
    repository = new TestableInMemorySupplierRequestLogRepository();
    scenarioResult = mockDeep<ScenarioResult>();
    context = mockDeep<Context>();

    context.requestId = testRequestId;
    context.getValidationRunId.mockReturnValue(testValidationRunId);
    context.getRequestDuration.mockReturnValue(testDuration);

    scenarioResult.name = 'Test Scenario';
    scenarioResult.success = true;
    scenarioResult.validationResult = ValidationResult.SUCCESS;
    scenarioResult.description = 'A test scenario description';
    scenarioResult.errors = [];
  });

  describe('logScenario', () => {
    it('should log a scenario with all data', async () => {
      const requestData = {
        url: 'https://api.example.com/endpoint',
        method: 'POST',
        body: { test: 'data' },
        headers: { 'Content-Type': 'application/json' },
      };

      const responseData = {
        status: 200,
        body: JSON.stringify({ result: 'success' }),
        headers: { 'Content-Type': 'application/json' },
        error: null,
      };

      scenarioResult.request = requestData;
      scenarioResult.response = responseData;

      const logs = repository.getLogs();
      expect(logs.length).toBe(0);

      await repository.logScenario(scenarioResult, context);

      expect(logs.length).toBe(1);
      const logEntry = logs[0];

      expect(logEntry).toEqual({
        id: testRequestId,
        validationRunId: testValidationRunId,
        createdAt: expect.any(String),
        reqBody: JSON.stringify(requestData.body),
        reqMethod: requestData.method,
        reqUrl: requestData.url,
        reqHeaders: JSON.stringify(requestData.headers),
        resStatus: responseData.status,
        resHeaders: JSON.stringify(responseData.headers),
        resBody: JSON.stringify(responseData.body),
        resDuration: testDuration,
        validationResult: ValidationResult.SUCCESS,
        isValid: true,
      });

      expect(Date.parse(logEntry.createdAt)).not.toBeNaN();
    });

    it('should handle scenario with null request and response', async () => {
      scenarioResult.request = null;
      scenarioResult.response = null;

      await repository.logScenario(scenarioResult, context);

      const logs = repository.getLogs();
      expect(logs.length).toBe(1);
      const logEntry = logs[0];

      expect(logEntry).toEqual({
        id: testRequestId,
        validationRunId: testValidationRunId,
        createdAt: expect.any(String),
        reqBody: null,
        reqMethod: null,
        reqUrl: null,
        reqHeaders: null,
        resStatus: null,
        resHeaders: null,
        resBody: null,
        resDuration: testDuration,
        validationResult: ValidationResult.SUCCESS,
        isValid: true,
      });
    });

    it('should handle scenario with partial request and response data', async () => {
      scenarioResult.request = {
        url: 'https://api.example.com/endpoint',
        method: 'GET',
        body: {} as Record<string, string> & DeepMockProxy<Record<string, string>>,
        headers: {},
      };

      scenarioResult.response = {
        status: 404,
        body: null,
        headers: {} as Record<string, string> & DeepMockProxy<Record<string, string>>,
        error: null,
      };

      await repository.logScenario(scenarioResult, context);

      const logs = repository.getLogs();
      expect(logs.length).toBe(1);
      const logEntry = logs[0];

      expect(logEntry).toEqual({
        id: testRequestId,
        validationRunId: testValidationRunId,
        createdAt: expect.any(String),
        reqBody: JSON.stringify({}),
        reqMethod: 'GET',
        reqUrl: 'https://api.example.com/endpoint',
        reqHeaders: JSON.stringify({}),
        resStatus: 404,
        resHeaders: JSON.stringify({}),
        resBody: null,
        resDuration: testDuration,
        validationResult: ValidationResult.SUCCESS,
        isValid: true,
      });
    });

    it('should handle failed validation scenarios', async () => {
      scenarioResult.success = false;
      scenarioResult.validationResult = ValidationResult.FAILED;

      await repository.logScenario(scenarioResult, context);

      const logs = repository.getLogs();
      expect(logs.length).toBe(1);
      const logEntry = logs[0];

      expect(logEntry.isValid).toBe(false);
      expect(logEntry.validationResult).toBe(ValidationResult.FAILED);
    });

    it('should store multiple log entries', async () => {
      const secondScenario = mockDeep<ScenarioResult>();
      secondScenario.success = false;
      secondScenario.validationResult = ValidationResult.WARNING;

      await repository.logScenario(scenarioResult, context);
      await repository.logScenario(secondScenario, context);

      const logs = repository.getLogs();
      expect(logs.length).toBe(2);

      expect(logs[0].isValid).toBe(true);
      expect(logs[0].validationResult).toBe(ValidationResult.SUCCESS);

      expect(logs[1].isValid).toBe(false);
      expect(logs[1].validationResult).toBe(ValidationResult.WARNING);
    });
  });
});
