import { singleton } from 'tsyringe';
import { Question } from '../../../question/Question';
import { StepId } from '../../StepId';
import { Validator } from '../../../validator/Validator';
import { Step } from '../../Step';

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

  public getDocsUrl(): string {
    return 'https://docs.octo.travel/octo-core/suppliers';
  }

  public getValidators(): Validator[] {
    return [];
  }

  public getQuestions(): Question[] {
    return [];
  }
}
