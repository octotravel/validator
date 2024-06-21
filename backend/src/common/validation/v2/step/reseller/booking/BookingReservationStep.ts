import { Step } from '../../Step';
import { StepId } from '../../StepId';
import { singleton } from 'tsyringe';
import { Question } from '../../../question/Question';
import { Validator } from '../../../validator/Validator';
import { RequestHeadersValidator } from '../../../validator/request/RequestHeadersValidator';
import { BookingReservationValidator } from '../../../validator/reseller/booking/BookingReservationValidator';

@singleton()
export class BookingReservationStep implements Step {
  public getId(): StepId {
    return StepId.BOOKING_RESERVATION;
  }

  public getName(): string {
    return 'Booking Reservation';
  }

  public getDescription(): string {
    return 'Create a booking that reserves the availability while you collect payment and contact information from the customer. The booking will remain with status ON_HOLD until the booking is confirmed or the reservation hold expires.';
  }

  public getEndpointMethod(): string {
    return 'POST';
  }

  public getEndpointUrl(): string {
    return '/bookings';
  }

  public getDocsUrl(): string {
    return 'https://docs.octo.travel/octo-api-core/bookings#booking-reservation';
  }

  public getValidators(): Validator[] {
    return [new RequestHeadersValidator(), new BookingReservationValidator()];
  }

  public getQuestions(): Question[] {
    return [];
  }
}
