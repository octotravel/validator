import { injectable } from '@needle-di/core';
import { Question } from '../../../question/Question';
import { Validator } from '../../../validator/Validator';
import { RequestHeadersValidator } from '../../../validator/request/RequestHeadersValidator';
import { Step } from '../../Step';
import { StepId } from '../../StepId';

@injectable()
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

  public getEndpointMethod(): string {
    return 'GET';
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
