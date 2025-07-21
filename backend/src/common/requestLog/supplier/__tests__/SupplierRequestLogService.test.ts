import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Context } from '../../../validation/v1/services/validation/context/Context';
import { ScenarioResult, ValidationResult } from '../../../validation/v1/services/validation/Scenarios/Scenario';
import { SupplierRequestLogRepository } from '../SupplierRequestLogRepository';
import { SupplierRequestLogService } from '../SupplierRequestLogService';

vi.mock('@needle-di/core', () => ({
  inject: vi.fn(),
}));

vi.mock('../../../database/PostgresDatabase', () => ({
  PostgresDatabase: vi.fn().mockImplementation(() => ({
    query: vi.fn().mockResolvedValue({ rows: [] }),
    isReady: vi.fn().mockResolvedValue(true),
  })),
}));

describe('SupplierRequestLogService', () => {
  let supplierRequestLogService: SupplierRequestLogService;
  let mockSupplierRequestLogRepository: SupplierRequestLogRepository;

  const mockScenario: ScenarioResult = {
    name: 'Test Scenario',
    success: true,
    validationResult: ValidationResult.SUCCESS,
    request: {
      url: 'https://example.com/api',
      method: 'GET',
      body: { test: 'data' },
      headers: { 'Content-Type': 'application/json' },
    },
    response: {
      body: JSON.stringify({ result: 'success' }),
      status: 200,
      error: null,
      headers: { 'Content-Type': 'application/json' },
    },
    errors: [],
    description: 'A test scenario for unit testing',
  };

  const mockContext: Context = {
    requestId: 'req-123',
    localDateStart: new Date(),
    getValidationRunId: vi.fn().mockReturnValue('val-456'),
    getRequestDuration: vi.fn().mockReturnValue(150),
  } as unknown as Context;

  beforeEach(() => {
    mockSupplierRequestLogRepository = {
      logScenario: vi.fn().mockResolvedValue(undefined),
    } as unknown as SupplierRequestLogRepository;

    supplierRequestLogService = new SupplierRequestLogService(mockSupplierRequestLogRepository);
  });

  describe('logScenario', () => {
    it('should call the repository logScenario method with the correct parameters', async () => {
      await supplierRequestLogService.logScenario(mockScenario, mockContext);

      expect(mockSupplierRequestLogRepository.logScenario).toHaveBeenCalledTimes(1);
      expect(mockSupplierRequestLogRepository.logScenario).toHaveBeenCalledWith(mockScenario, mockContext);
    });

    it('should propagate any errors from the repository', async () => {
      const expectedError = new Error('Database error');
      mockSupplierRequestLogRepository.logScenario = vi.fn().mockRejectedValue(expectedError);

      await expect(supplierRequestLogService.logScenario(mockScenario, mockContext)).rejects.toThrow(expectedError);
    });

    it('should complete without returning a value when successful', async () => {
      const result = await supplierRequestLogService.logScenario(mockScenario, mockContext);

      expect(result).toBeUndefined();
    });
  });
});
