import { singleton } from 'tsyringe';
import { Question } from '../../../question/Question';
import { StepId } from '../../StepId';
import { Validator } from '../../../validator/Validator';
import { Step } from '../../Step';
import { RequestHeadersValidator } from '../../../validator/request/RequestHeadersValidator';

@singleton()
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

  public getEndpointUrl(): string {
    return '/suppliers';
  }

  public getDocsUrl(): string {
    return 'https://docs.octo.travel/octo-core/suppliers';
  }

  public getValidators(): Validator[] {
    return [new RequestHeadersValidator()];
  }

  public getQuestions(): Question[] {
    return [];
  }
}
