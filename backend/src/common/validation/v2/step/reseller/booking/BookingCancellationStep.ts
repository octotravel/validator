import { Question } from '../../../question/Question';
import { Validator } from '../../../validator/Validator';
import { RequestHeadersValidator } from '../../../validator/request/RequestHeadersValidator';
import { BookingCancellationValidator } from '../../../validator/reseller/booking/BookingCancellationValidator';
import { Step } from '../../Step';
import { StepId } from '../../StepId';

export class BookingCancellationStep implements Step {
  public getId(): StepId {
    return StepId.BOOKING_CANCELLATION;
  }

  public getName(): string {
    return 'Booking Cancellation';
  }

  public getDescription(): string {
    return 'For cancelling bookings. You can only cancel a booking if booking.cancellable is TRUE, and is within the booking cancellation cut-off window.';
  }

  public getEndpointMethod(): string {
    return 'POST';
  }

  public getEndpointUrl(): string {
    return '/bookings/{uuid}/cancel';
  }

  public getDocsUrl(): string {
    return 'https://docs.octo.travel/octo-api-core/bookings#booking-cancellation';
  }

  public getValidators(): Validator[] {
    return [new RequestHeadersValidator(), new BookingCancellationValidator()];
  }

  public getQuestions(): Question[] {
    return [];
  }
}
