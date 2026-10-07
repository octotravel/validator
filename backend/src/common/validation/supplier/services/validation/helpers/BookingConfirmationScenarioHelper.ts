import { Booking, BookingConfirmationBody } from '@octocloud/types';
import { STATUS_SUCCESS } from '../../../models/Error';
import { BookingEndpointValidator } from '../../../validators/backendValidator/Booking/BookingEndpointValidator';
import { BookingValidator } from '../../../validators/backendValidator/Booking/BookingValidator';
import { ResponseStatusValidator } from '../../../validators/backendValidator/Response/ResponseStatusValidator';
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
    const statusErrors = new ResponseStatusValidator({ expectedStatus: STATUS_SUCCESS }).validate(result);
    if (!response || response.error) {
      return this.handleResult({
        ...data,
        errors: statusErrors,
      });
    }

    const errors = [
      ...statusErrors,
      ...this.bookingEndpointValidator.validateConfirmation({
        booking,
        reservation,
        schema: request?.body as unknown as BookingConfirmationBody,
      }),
      ...this.bookingEndpointValidator.validate({
        booking,
        productId: reservation.productId,
        optionId: reservation.optionId,
        availabilityId: reservation.availabilityId!,
      }),
      ...new BookingValidator({
        capabilities: context.getCapabilityIDs(),
        shouldNotHydrate: context.shouldNotHydrate,
      }).validate(booking),
    ];

    if (this.shouldTerminateValidation(errors, booking?.uuid)) {
      context.terminateValidation = true;
    }
    return this.handleResult({
      ...data,
      errors,
    });
  };
}
