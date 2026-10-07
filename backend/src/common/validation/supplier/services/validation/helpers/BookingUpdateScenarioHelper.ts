import { Booking, BookingUpdateBody } from '@octocloud/types';
import { STATUS_SUCCESS } from '../../../models/Error';
import { BookingEndpointValidator } from '../../../validators/backendValidator/Booking/BookingEndpointValidator';
import { BookingValidator } from '../../../validators/backendValidator/Booking/BookingValidator';
import { ResponseStatusValidator } from '../../../validators/backendValidator/Response/ResponseStatusValidator';
import { Context } from '../context/Context';
import { ScenarioResult } from '../Scenarios/Scenario';
import { ScenarioHelper, ScenarioHelperData } from './ScenarioHelper';

export class BookingUpdateScenarioHelper extends ScenarioHelper {
  private readonly bookingEndpointValidator = new BookingEndpointValidator();
  public validateBookingUpdate = (
    data: ScenarioHelperData<Booking>,
    booking: Booking,
    context: Context,
  ): ScenarioResult => {
    const { result } = data;
    const bookingUpdated = result?.data;
    const request = result?.request;
    const response = result?.response;
    const schema = request?.body as BookingUpdateBody;
    const statusErrors = new ResponseStatusValidator({ expectedStatus: STATUS_SUCCESS }).validate(result);
    if (!response || response.error) {
      return this.handleResult({
        ...data,
        errors: statusErrors,
      });
    }

    const errors = [
      ...statusErrors,
      ...this.bookingEndpointValidator.validateUpdate({
        booking,
        bookingUpdated,
        schema,
      }),
      ...this.bookingEndpointValidator.validate({
        booking: result.data,
        productId: schema.productId ?? booking.productId,
        optionId: schema.optionId ?? booking.optionId,
        availabilityId: schema.availabilityId ?? booking.availabilityId!,
      }),
      ...new BookingValidator({
        capabilities: context.getCapabilityIDs(),
      }).validate(booking),
    ];
    return this.handleResult({
      ...data,
      errors,
    });
  };
}
