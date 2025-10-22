import { Booking, BookingReservationBody } from '@octocloud/types';
import { BookingEndpointValidator } from '../../../validators/backendValidator/Booking/BookingEndpointValidator';
import { BookingValidator } from '../../../validators/backendValidator/Booking/BookingValidator';
import { Context } from '../context/Context';
import { ScenarioResult } from '../Scenarios/Scenario';
import { ScenarioHelper, ScenarioHelperData } from './ScenarioHelper';

export class BookingReservationScenarioHelper extends ScenarioHelper {
  private readonly bookingEndpointValidator = new BookingEndpointValidator();

  public validateBookingReservation = (data: ScenarioHelperData<Booking>, context: Context): ScenarioResult => {
    const { result } = data;
    const reservation = result?.data;
    const request = result?.request;
    const response = result?.response;
    if (response?.error) {
      return this.handleResult({
        ...data,
        success: false,
        errors: [],
      });
    }

    const errors = [
      ...this.bookingEndpointValidator.validateReservation({
        schema: request?.body as unknown as BookingReservationBody,
        reservation,
      }),
      ...this.bookingEndpointValidator.validate({
        booking: reservation,
        productId: request?.body?.productId as string,
        optionId: request?.body?.optionId as string,
        availabilityId: request?.body?.availabilityId as string,
      }),
      ...new BookingValidator({
        capabilities: context.getCapabilityIDs(),
      }).validate(result.data),
    ];

    if (this.shouldTerminateValidation(errors, reservation?.uuid, response?.status)) {
      context.terminateValidation = true;
    }
    return this.handleResult({
      ...data,
      errors,
    });
  };
}
