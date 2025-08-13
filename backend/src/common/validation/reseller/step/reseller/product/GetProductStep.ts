import { Question, QuestionInputType } from '../../../question/Question';
import { RequestHeadersValidator } from '../../../validator/request/RequestHeadersValidator';
import { Validator } from '../../../validator/Validator';
import { Step } from '../../Step';
import { StepId } from '../../StepId';

export class GetProductStep implements Step {
  public getId(): StepId {
    return StepId.GET_PRODUCT;
  }

  public getName(): string {
    return 'Get Product';
  }

  public getDescription(): string {
    return 'Fetch the product for the given id.';
  }

  public getEndpointMethod(): string {
    return 'GET';
  }

  public getEndpointUrl(): string {
    return '/products/{id}';
  }

  public getDocsUrl(): string {
    return 'https://docs.octo.travel/octo-api-core/products#get-product';
  }

  public getValidators(): Validator[] {
    return [new RequestHeadersValidator()];
  }

  public getQuestions(): Question[] {
    return [
      {
        id: 'qr_code_first_passenger',
        label: 'What is the value of the QR code for the 1st passenger in the response?',
        description: 'Get it from dummy data.',
        input: {
          type: QuestionInputType.STRING,
          options: [],
        },
        answer: async () => {
          return 'DUMMY_QR_CODE';
        },
      },
      {
        id: 'price_first_unit',
        label: 'What is the price for the first unit returned in the response?',
        description: 'Get it from dummy data.',
        input: {
          type: QuestionInputType.NUMBER,
          options: [],
        },
        answer: async () => {
          return 123;
        },
      },
    ];
  }
}
