import { inject, singleton } from 'tsyringe';
import { Backend } from '@octocloud/core';
import { Booking } from '@octocloud/types';
import { BackendParamsUtil } from '../../../../util/BackendParamsUtil';
import { SessionStepValidationProcessor } from '../../session/SessionStepValidationProcessor';
import { BookingReservationStep } from '../../step/reseller/booking/BookingReservatitonStep';
import { BookingConfirmationStep } from '../../step/reseller/booking/BookingConfirmationStep';

@singleton()
export class BookingFacade {
  public constructor(
    @inject('Backend') private readonly backend: Backend,
    @inject(BookingReservationStep) private readonly bookingReservationStep: BookingReservationStep,
    @inject(BookingConfirmationStep) private readonly bookingConfirmationStep: BookingConfirmationStep,
    @inject(SessionStepValidationProcessor)
    private readonly sessionStepValidationProcessor: SessionStepValidationProcessor,
  ) {}

  public async bookingReservation(bookingReservationData: any): Promise<Booking> {
    await this.sessionStepValidationProcessor.process(this.bookingReservationStep, bookingReservationData);
    return await this.backend.createBooking(bookingReservationData, BackendParamsUtil.create());
  }

  public async bookingConfirmation(bookingConfirmationData: any): Promise<Booking> {
    await this.sessionStepValidationProcessor.process(this.bookingConfirmationStep, bookingConfirmationData);
    return await this.backend.confirmBooking(bookingConfirmationData, BackendParamsUtil.create());
  }
}
