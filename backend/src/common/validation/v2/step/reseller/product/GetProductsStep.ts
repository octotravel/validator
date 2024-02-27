import { Step } from '../../Step';
import { Validator } from '../../../validation/v2/validator/Validator';
import { Question } from '../../../validation/v2/question/Question';
import { StepId } from '../../../types/StepId';

export class GetProductsStep implements Step {
  public getId(): StepId {
    return 'get-products';
  }

  public getName(): string {
    return 'Get Products';
  }

  public getDocsUrl(): string {
    return 'https://docs.octo.travel/octo-api-core/products';
  }

  public getValidators(): Validator[] {
    return [];
  }

  public getQuestions(): Question[] {
    return [];
  }
}
