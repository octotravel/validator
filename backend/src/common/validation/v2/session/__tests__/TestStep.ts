import { StepId } from '../../step/StepId';
import { Validator } from '../../validator/Validator';
import { Question } from '../../question/Question';
import { Step } from '../../step/Step';

export class TestStep implements Step {
  public getId(): StepId {
    return StepId.TEST;
  }

  public getName(): string {
    return 'Test Step';
  }

  public getDescription(): string {
    return '';
  }

  public getEndpointMethod(): string {
    return '';
  }

  public getEndpointUrl(): string {
    return '';
  }

  public getDocsUrl(): string {
    return '';
  }

  public getValidators(): Validator[] {
    return [];
  }

  public getQuestions(): Question[] {
    return [];
  }
}
