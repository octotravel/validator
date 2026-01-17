import { inject } from '@needle-di/core';
import { OctoBackend } from '@octocloud/backend';
import { Booking } from '@octocloud/types';
import { RequestScopedContextProvider } from '../../../../requestContext/RequestScopedContextProvider';
import { SessionStepValidationProcessor } from '../../session/SessionStepValidationProcessor';
import { BookingCancellationStep } from '../../step/reseller/booking/BookingCancellationStep';
import { BookingConfirmationStep } from '../../step/reseller/booking/BookingConfirmationStep';
import { BookingReservationStep } from '../../step/reseller/booking/BookingReservationStep';

export class BookingFacade {
  public constructor(
    private readonly backend = inject<OctoBackend>('OctoBackend'),
    private readonly bookingReservationStep = inject(BookingReservationStep),
    private readonly bookingConfirmationStep = inject(BookingConfirmationStep),
    private readonly bookingCancellationStep = inject(BookingCancellationStep),
    private readonly sessionStepValidationProcessor = inject(SessionStepValidationProcessor),
    private readonly requestScopedContextProvider = inject(RequestScopedContextProvider),
  ) {}

  // biome-ignore lint/suspicious/noExplicitAny: <?>
  public async bookingReservation(bookingReservationData: any): Promise<Booking> {
    await this.sessionStepValidationProcessor.process(this.bookingReservationStep, bookingReservationData);
    return (await this.backend.createBooking(bookingReservationData, {
      ctx: this.requestScopedContextProvider.getRequestScopedContext().getVentrataRequestContext(),
    })) as Booking;
  }

  // biome-ignore lint/suspicious/noExplicitAny: <?>
  public async bookingConfirmation(bookingConfirmationData: any): Promise<Booking> {
    await this.sessionStepValidationProcessor.process(this.bookingConfirmationStep, bookingConfirmationData);
    return (await this.backend.confirmBooking(bookingConfirmationData, {
      ctx: this.requestScopedContextProvider.getRequestScopedContext().getVentrataRequestContext(),
    })) as Booking;
  }

  // biome-ignore lint/suspicious/noExplicitAny: <?>
  public async bookingCancellation(bookingCancellationData: any): Promise<Booking> {
    await this.sessionStepValidationProcessor.process(this.bookingCancellationStep, bookingCancellationData);
    return (await this.backend.cancelBooking(bookingCancellationData, {
      ctx: this.requestScopedContextProvider.getRequestScopedContext().getVentrataRequestContext(),
    })) as Booking;
  }
}
