import { Question } from '../../../question/Question';
import { Validator } from '../../../validator/Validator';
import { RequestHeadersValidator } from '../../../validator/request/RequestHeadersValidator';
import { BookingConfirmationValidator } from '../../../validator/reseller/booking/BookingConfirmationValidator';
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
    return [];
  }
}
