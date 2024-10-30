import { inject, singleton } from 'tsyringe';
import { Backend } from '@octocloud/core';
import { Booking } from '@octocloud/types';
import { BackendParamsUtil } from '../../../../util/BackendParamsUtil';
import { SessionStepValidationProcessor } from '../../session/SessionStepValidationProcessor';
import { BookingReservationStep } from '../../step/reseller/booking/BookingReservationStep';
import { BookingConfirmationStep } from '../../step/reseller/booking/BookingConfirmationStep';
import { BookingCancellationStep } from '../../step/reseller/booking/BookingCancellationStep';
import { RequestScopedContextProvider } from '../../../../requestContext/RequestScopedContextProvider';

@singleton()
export class BookingFacade {
  public constructor(
    @inject('Backend') private readonly backend: Backend,
    @inject(BookingReservationStep) private readonly bookingReservationStep: BookingReservationStep,
    @inject(BookingConfirmationStep) private readonly bookingConfirmationStep: BookingConfirmationStep,
    @inject(BookingCancellationStep) private readonly bookingCancellationStep: BookingCancellationStep,
    @inject(SessionStepValidationProcessor)
    private readonly sessionStepValidationProcessor: SessionStepValidationProcessor,
    @inject(RequestScopedContextProvider) private readonly requestScopedContextProvider: RequestScopedContextProvider,
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
