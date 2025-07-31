import { StepId } from '../../../common/validation/v2/step/StepId';
import { ValidationResult } from '../../../common/validation/v2/ValidationResult';

export interface GetSessionValidationHistoryResponse {
  stepId: StepId;
  reqHeaders: Record<string, string>;
  reqBody: string;
  validationResult: ValidationResult;
  isValid: boolean;
}
