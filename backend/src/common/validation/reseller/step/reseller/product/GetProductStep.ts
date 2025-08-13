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
        id: 'what_is_god',
        label: 'What is god?',
        description: 'Yes or no?',
        input: {
          type: QuestionInputType.OPTION,
          options: [
            {
              label: 'Yes',
              value: 'yes',
            },
            {
              label: 'No',
              value: 'no',
            },
          ],
        },
        answer: async () => {
          return 'yes';
        },
      },
      {
        id: 'what_is_love',
        label: 'What is love?',
        description: 'Baby, dont hurt me.',
        input: {
          type: QuestionInputType.STRING,
          options: [],
        },
        answer: async () => {
          return 'baby dont hurt me';
        },
      },
      {
        id: 'what_is_the_meaning_of_life',
        label: 'What is the meaning of life?',
        description: '42.',
        input: {
          type: QuestionInputType.NUMBER,
          options: [],
        },
        answer: async () => {
          return 42;
        },
      },
      {
        id: 'what_is_the_answer_to_the_ultimate_question_of_life_the_universe_and_everything',
        label: 'What is the answer to the ultimate question of life, the universe, and everything?',
        description: 'true or false',
        input: {
          type: QuestionInputType.BOOLEAN,
          options: [],
        },
        answer: async () => {
          return true;
        },
      },
    ];
  }
}
