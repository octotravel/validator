import { Question } from '../question/Question';
import { Validator } from '../validator/request/Validator';
import { Step } from './Step';

export class GetSupplierStep implements Step {
  public getId(): string {
    return 'get-supplier';
  }

  public getName(): string {
    return 'Get Supplier';
  }

  public getDocsUrl(): string {
    return 'https://docs.octo.travel/octo-core/suppliers';
  }

  public getValidators(): Array<Validator<void>> {
    return [];
  }

  public getQuestions(): Question[] {
    return [];
  }
}
