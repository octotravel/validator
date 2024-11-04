import { Backend } from '@octocloud/core';
import { Booking } from '@octocloud/types';
import { SessionStepValidationProcessor } from '../../session/SessionStepValidationProcessor';
import { BookingReservationStep } from '../../step/reseller/booking/BookingReservationStep';
import { BookingConfirmationStep } from '../../step/reseller/booking/BookingConfirmationStep';
import { BookingCancellationStep } from '../../step/reseller/booking/BookingCancellationStep';
import { RequestScopedContextProvider } from '../../../../requestContext/RequestScopedContextProvider';
import { inject } from '@needle-di/core';

export class BookingFacade {
  public constructor(
    private readonly backend: Backend = inject<Backend>('Backend'),
    private readonly bookingReservationStep: BookingReservationStep = inject(BookingReservationStep),
    private readonly bookingConfirmationStep: BookingConfirmationStep = inject(BookingConfirmationStep),
    private readonly bookingCancellationStep: BookingCancellationStep = inject(BookingCancellationStep),
    private readonly sessionStepValidationProcessor: SessionStepValidationProcessor = inject(
      SessionStepValidationProcessor,
    ),
    private readonly requestScopedContextProvider: RequestScopedContextProvider = inject(RequestScopedContextProvider),
  ) {}

  public async bookingReservation(bookingReservationData: any): Promise<Booking> {
    await this.sessionStepValidationProcessor.process(this.bookingReservationStep, bookingReservationData);
    return await this.backend.createBooking(bookingReservationData, {
      ctx: this.requestScopedContextProvider.getRequestScopedContext().getVentrataRequestContext(),
    });
  }

  public async bookingConfirmation(bookingConfirmationData: any): Promise<Booking> {
    await this.sessionStepValidationProcessor.process(this.bookingConfirmationStep, bookingConfirmationData);
    return await this.backend.confirmBooking(bookingConfirmationData, {
      ctx: this.requestScopedContextProvider.getRequestScopedContext().getVentrataRequestContext(),
    });
  }

  public async bookingCancellation(bookingCancellationData: any): Promise<Booking> {
    await this.sessionStepValidationProcessor.process(this.bookingCancellationStep, bookingCancellationData);
    return await this.backend.cancelBooking(bookingCancellationData, {
      ctx: this.requestScopedContextProvider.getRequestScopedContext().getVentrataRequestContext(),
    });
  }
}
