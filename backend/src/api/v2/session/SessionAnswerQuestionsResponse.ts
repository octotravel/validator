import { ValidationResult } from '../../../common/validation/v2/ValidationResult';
import { StepId } from '../../../common/validation/v2/step/StepId';

export interface GetSessionValidationHistoryResponse {
  stepId: StepId;
  reqHeaders: Record<string, string>;
  reqBody: string;
  validationResult: ValidationResult;
  isValid: boolean;
}
