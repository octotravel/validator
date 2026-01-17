import { Question } from '../../../question/Question';
import { RequestHeadersValidator } from '../../../validator/request/RequestHeadersValidator';
import { Validator } from '../../../validator/Validator';
import { Step } from '../../Step';
import { StepId } from '../../StepId';

export class GetSupplierStep implements Step {
  public getId(): StepId {
    return StepId.GET_SUPPLIER;
  }

  public getName(): string {
    return 'Get Supplier';
  }

  public getDescription(): string {
    return 'Returns the supplier and associated contact details.';
  }

  public getEndpointMethod(): string {
    return 'GET';
  }

  public getEndpointUrl(): string {
    return '/supplier';
  }

  public getDocsUrl(): string {
    return 'https://docs.octo.travel/octo-api-core/supplier';
  }

  public getValidators(): Validator[] {
    return [new RequestHeadersValidator()];
  }

  public getQuestions(): Question[] {
    return [];
  }
}
