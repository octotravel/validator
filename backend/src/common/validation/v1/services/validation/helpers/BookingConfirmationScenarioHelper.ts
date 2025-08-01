import { Booking, ConfirmBookingBodySchema } from '@octocloud/types';
import { BookingEndpointValidator } from '../../../validators/backendValidator/Booking/BookingEndpointValidator';
import { BookingValidator } from '../../../validators/backendValidator/Booking/BookingValidator';
import { Context } from '../context/Context';
import { ScenarioResult } from '../Scenarios/Scenario';
import { ScenarioHelper, ScenarioHelperData } from './ScenarioHelper';

export class BookingConfirmationScenarioHelper extends ScenarioHelper {
  private readonly bookingEndpointValidator = new BookingEndpointValidator();

  public validateBookingConfirmation = (
    data: ScenarioHelperData<Booking>,
    reservation: Booking,
    context: Context,
  ): ScenarioResult => {
    const { result } = data;
    const booking = result?.data;
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
      ...this.bookingEndpointValidator.validateConfirmation({
        booking,
        reservation,
        schema: request?.body as unknown as ConfirmBookingBodySchema,
      }),
      ...this.bookingEndpointValidator.validate({
        booking,
        productId: reservation.productId,
        optionId: reservation.optionId,
        availabilityId: reservation.availabilityId,
      }),
      ...new BookingValidator({
        capabilities: context.getCapabilityIDs(),
        shouldNotHydrate: context.shouldNotHydrate,
      }).validate(booking),
    ];

    if (this.shouldTerminateValidation(errors, booking?.uuid, response?.status)) {
      context.terminateValidation = true;
    }
    return this.handleResult({
      ...data,
      errors,
    });
  };
}
