import { StepId } from '../../../common/validation/reseller/step/StepId';
import { ValidationResult } from '../../../common/validation/reseller/ValidationResult';

export interface GetSessionValidationHistoryResponse {
  stepId: StepId;
  reqHeaders: Record<string, string>;
  reqBody: string;
  validationResult: ValidationResult;
  isValid: boolean;
}
