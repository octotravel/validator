import { Booking, BookingCancellationBody } from '@octocloud/types';
import { STATUS_SUCCESS } from '../../../models/Error';
import { BookingEndpointValidator } from '../../../validators/backendValidator/Booking/BookingEndpointValidator';
import { BookingValidator } from '../../../validators/backendValidator/Booking/BookingValidator';
import { ResponseStatusValidator } from '../../../validators/backendValidator/Response/ResponseStatusValidator';
import { Context } from '../context/Context';
import { ScenarioResult } from '../Scenarios/Scenario';
import { ScenarioHelper, ScenarioHelperData } from './ScenarioHelper';

export class BookingCancellationScenarioHelper extends ScenarioHelper {
  private readonly bookingEndpointValidator = new BookingEndpointValidator();

  public validateBookingCancellation = (
    data: ScenarioHelperData<Booking>,
    booking: Booking,
    context: Context,
  ): ScenarioResult => {
    const { result } = data;
    const bookingCancelled = result?.data;
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
      ...this.bookingEndpointValidator.validateCancel({
        booking,
        bookingCancelled,
        schema: request?.body as BookingCancellationBody,
      }),
      ...this.bookingEndpointValidator.validate({
        booking: result.data,
        productId: booking?.productId,
        optionId: booking?.optionId,
        availabilityId: booking?.availabilityId!,
      }),
      ...new BookingValidator({
        capabilities: context.getCapabilityIDs(),
        shouldNotHydrate: context.shouldNotHydrate,
      }).validate(booking),
    ];

    return this.handleResult({
      ...data,
      errors,
    });
  };
}
