import { Step } from '../../Step';
import { StepId } from '../../StepId';
import { singleton } from 'tsyringe';
import { Question } from '../../../question/Question';
import { Validator } from '../../../validator/Validator';

@singleton()
export class GetProductStep implements Step {
  public getId(): StepId {
    return StepId.GET_PRODUCT;
  }

  public getName(): string {
    return 'Get Product';
  }

  public getDescription(): string {
    return '';
  }

  public getDocsUrl(): string {
    return 'https://docs.octo.travel/octo-api-core/products#get-product';
  }

  public getValidators(): Validator[] {
    return [];
  }

  public getQuestions(): Question[] {
    return [];
  }
}
