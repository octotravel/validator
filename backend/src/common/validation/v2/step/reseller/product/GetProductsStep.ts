import { Step } from '../../Step';
import { StepId } from '../../StepId';
import { singleton } from 'tsyringe';
import { Question } from '../../../question/Question';
import { Validator } from '../../../validator/Validator';
import { RequestHeadersValidator } from '../../../validator/request/RequestHeadersValidator';

@singleton()
export class GetProductsStep implements Step {
  public getId(): StepId {
    return StepId.GET_PRODUCTS;
  }

  public getName(): string {
    return 'Get Products';
  }

  public getDescription(): string {
    return 'Fetch the list of products available to you.';
  }

  public getEndpointUrl(): string {
    return '/products';
  }

  public getDocsUrl(): string {
    return 'https://docs.octo.travel/octo-api-core/products#get-products';
  }

  public getValidators(): Validator[] {
    return [new RequestHeadersValidator()];
  }

  public getQuestions(): Question[] {
    return [];
  }
}
