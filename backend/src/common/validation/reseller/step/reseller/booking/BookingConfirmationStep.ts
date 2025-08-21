import { Question, QuestionInputType } from '../../../question/Question';
import { RequestHeadersValidator } from '../../../validator/request/RequestHeadersValidator';
import { BookingConfirmationValidator } from '../../../validator/reseller/booking/BookingConfirmationValidator';
import { Validator } from '../../../validator/Validator';
import { Step } from '../../Step';
import { StepId } from '../../StepId';

export class BookingConfirmationStep implements Step {
  public getId(): StepId {
    return StepId.BOOKING_CONFIRMATION;
  }

  public getName(): string {
    return 'Booking Confirmation';
  }

  public getDescription(): string {
    return "This endpoint confirms the booking so it's ready to be used.";
  }

  public getEndpointMethod(): string {
    return 'POST';
  }

  public getEndpointUrl(): string {
    return '/bookings/{uuid}/confirm';
  }

  public getDocsUrl(): string {
    return 'https://docs.octo.travel/octo-api-core/bookings#booking-confirmation';
  }

  public getValidators(): Validator[] {
    return [new RequestHeadersValidator(), new BookingConfirmationValidator()];
  }

  public getQuestions(): Question[] {
    return [
      // {
      //   id: 'qr_code_first_passenger',
      //   label: 'What is the value of the QR code for the 1st passenger in the response?',
      //   description: 'Get it from the response data.',
      //   input: {
      //     type: QuestionInputType.STRING,
      //     options: [],
      //   },
      //   answer: async () => {
      //     return 'QR_CODE';
      //   },
      // },
      {
        id: 'price_first_unit',
        label: 'What is the price for the first unit returned in the response?',
        description: 'Get it from the response data.',
        input: {
          type: QuestionInputType.NUMBER,
          options: [],
        },
        answer: async () => {
          return 1000;
        },
      },
    ];
  }
}
