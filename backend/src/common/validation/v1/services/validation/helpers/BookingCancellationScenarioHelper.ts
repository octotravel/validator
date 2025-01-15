import { Booking, CancelBookingBodySchema } from '@octocloud/types';
import { BookingEndpointValidator } from '../../../validators/backendValidator/Booking/BookingEndpointValidator';
import { BookingValidator } from '../../../validators/backendValidator/Booking/BookingValidator';
import { ScenarioResult } from '../Scenarios/Scenario';
import { Context } from '../context/Context';
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
    if (response?.error) {
      return this.handleResult({
        ...data,
        success: false,
        errors: [],
      });
    }

    const errors = [
      ...this.bookingEndpointValidator.validateCancel({
        booking,
        bookingCancelled,
        schema: request?.body as CancelBookingBodySchema,
      }),
      ...this.bookingEndpointValidator.validate({
        booking: result.data,
        productId: booking?.productId,
        optionId: booking?.optionId,
        availabilityId: booking?.availabilityId,
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
