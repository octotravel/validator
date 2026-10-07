import { Booking, ExtendReservationBody } from '@octocloud/types';
import { STATUS_SUCCESS } from '../../../models/Error';
import { BookingEndpointValidator } from '../../../validators/backendValidator/Booking/BookingEndpointValidator';
import { BookingValidator } from '../../../validators/backendValidator/Booking/BookingValidator';
import { ResponseStatusValidator } from '../../../validators/backendValidator/Response/ResponseStatusValidator';
import { Context } from '../context/Context';
import { ScenarioResult } from '../Scenarios/Scenario';
import { ScenarioHelper, ScenarioHelperData } from './ScenarioHelper';

export class BookingExtendScenarioHelper extends ScenarioHelper {
  private readonly bookingEndpointValidator = new BookingEndpointValidator();

  public validateBookingExtend = (
    data: ScenarioHelperData<Booking>,
    reservation: Booking,
    context: Context,
  ): ScenarioResult => {
    const { result } = data;
    const request = result?.request;
    const response = result?.response;
    const reservationExtended = result?.data;
    const statusErrors = new ResponseStatusValidator({ expectedStatus: STATUS_SUCCESS }).validate(result);
    if (!response || response.error) {
      return this.handleResult({
        ...data,
        errors: statusErrors,
      });
    }

    const errors = [
      ...statusErrors,
      ...this.bookingEndpointValidator.validateReservationExtend({
        reservation,
        reservationExtended,
        schema: request?.body as ExtendReservationBody,
      }),
      ...this.bookingEndpointValidator.validate({
        booking: reservationExtended,
        productId: reservation.productId,
        optionId: reservation.optionId,
        availabilityId: reservation.availabilityId!,
      }),
      ...new BookingValidator({
        capabilities: context.getCapabilityIDs(),
        shouldNotHydrate: context.shouldNotHydrate,
      }).validate(result.data),
    ];

    return this.handleResult({
      ...data,
      errors,
    });
  };
}
