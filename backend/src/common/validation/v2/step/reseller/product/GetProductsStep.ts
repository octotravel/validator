import { Step } from '../../Step';
import { StepId } from '../../../types/StepId';
import { singleton } from 'tsyringe';
import { Question } from '../../../question/Question';
import { Validator } from '../../../validator/Validator';

@singleton()
export class GetProductsStep implements Step {
  public getId(): StepId {
    return StepId.GET_PRODUCTS;
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
