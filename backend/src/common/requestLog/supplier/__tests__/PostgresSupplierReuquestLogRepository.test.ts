import { beforeEach, describe, expect, it } from 'vitest';
import { DeepMockProxy, mockDeep } from 'vitest-mock-extended';
import { Context } from '../../../validation/v1/services/validation/context/Context';
import {
  ScenarioRequest,
  ScenarioResponse,
  ScenarioResult,
  ValidationResult,
} from '../../../validation/v1/services/validation/Scenarios/Scenario';
import { ErrorType, MappedError } from '../../../validation/v1/validators/backendValidator/ValidatorHelpers';
import { SupplierRequestLogRepository } from '../SupplierRequestLogRepository';
import { SupplierRequestLogService } from '../SupplierRequestLogService';

describe('SupplierRequestLogService', () => {
  let supplierRequestLogService: SupplierRequestLogService;
  let supplierRequestLogRepository: DeepMockProxy<SupplierRequestLogRepository>;
  let scenarioResult: DeepMockProxy<ScenarioResult>;
  let context: DeepMockProxy<Context>;
  let scenarioRequest: DeepMockProxy<ScenarioRequest>;
  let scenarioResponse: DeepMockProxy<ScenarioResponse>;
  let mappedError: MappedError;

  beforeEach(() => {
    supplierRequestLogRepository = mockDeep<SupplierRequestLogRepository>();
    scenarioRequest = mockDeep<ScenarioRequest>();
    scenarioResponse = mockDeep<ScenarioResponse>();
    context = mockDeep<Context>();
    mappedError = { type: ErrorType.WARNING, message: 'Test error message' };

    scenarioResult = mockDeep<ScenarioResult>();
    scenarioResult.name = 'Test Scenario';
    scenarioResult.success = true;
    scenarioResult.validationResult = ValidationResult.SUCCESS;
    scenarioResult.request = scenarioRequest;
    scenarioResult.response = scenarioResponse;
    scenarioResult.errors = [mappedError];
    scenarioResult.description = 'Test scenario description';

    context.requestId = 'req-12345';
    context.localDateStart = new Date().toISOString();
    context.getValidationRunId.mockReturnValue('val-12345');
    context.getRequestDuration.mockReturnValue(200);

    supplierRequestLogService = new SupplierRequestLogService(supplierRequestLogRepository);
  });

  describe('logScenario', () => {
    it('should call the repository logScenario method with the correct parameters', async () => {
      await supplierRequestLogService.logScenario(scenarioResult, context);

      expect(supplierRequestLogRepository.logScenario).toHaveBeenCalledTimes(1);
      expect(supplierRequestLogRepository.logScenario).toHaveBeenCalledWith(scenarioResult, context);
    });

    it('should propagate any errors from the repository', async () => {
      const expectedError = new Error('Database error');
      supplierRequestLogRepository.logScenario.mockRejectedValueOnce(expectedError);

      await expect(supplierRequestLogService.logScenario(scenarioResult, context)).rejects.toThrow(expectedError);
    });

    it('should complete without returning a value when successful', async () => {
      supplierRequestLogRepository.logScenario.mockResolvedValueOnce(undefined);

      const result = await supplierRequestLogService.logScenario(scenarioResult, context);

      expect(result).toBeUndefined();
    });

    it('should work with a scenario that has null request and response', async () => {
      const minimalScenario: ScenarioResult = {
        name: 'Minimal Scenario',
        success: false,
        validationResult: ValidationResult.FAILED,
        request: null,
        response: null,
        errors: [{ type: ErrorType.WARNING, message: 'Test error' }],
        description: 'Minimal test scenario',
      };

      await supplierRequestLogService.logScenario(minimalScenario, context);

      expect(supplierRequestLogRepository.logScenario).toHaveBeenCalledWith(minimalScenario, context);
    });

    it('should handle a scenario with warning validation result', async () => {
      scenarioResult.validationResult = ValidationResult.WARNING;

      await supplierRequestLogService.logScenario(scenarioResult, context);

      expect(supplierRequestLogRepository.logScenario).toHaveBeenCalledWith(
        expect.objectContaining({
          validationResult: ValidationResult.WARNING,
        }),
        context,
      );
    });
  });
});
