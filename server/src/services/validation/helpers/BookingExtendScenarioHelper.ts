import { Booking, ExtendBookingBodySchema } from "@octocloud/types";
import { BookingEndpointValidator } from "../../../validators/backendValidator/Booking/BookingEndpointValidator.ts";
import { BookingValidator } from "../../../validators/backendValidator/Booking/BookingValidator.ts";
import { Context } from "../context/Context.ts";
import {
  ScenarioHelper,
  ScenarioHelperData,
} from "./ScenarioHelper.ts";

export class BookingExtendScenarioHelper extends ScenarioHelper {
  private bookingEndpointValidator = new BookingEndpointValidator();

  public validateBookingExtend = (
    data: ScenarioHelperData<Booking>,
    reservation: Booking,
    context: Context
  ) => {
    const { result } = data;
    const request = result?.request;
    const response = result?.response;
    const reservationExtended = result?.data;
    if (response?.error) {
      return this.handleResult({
        ...data,
        success: false,
        errors: [],
      });
    }

    const errors = [
      ...this.bookingEndpointValidator.validateReservationExtend({
        reservation,
        reservationExtended,
        schema: request?.body as ExtendBookingBodySchema,
      }),
      ...this.bookingEndpointValidator.validate({
        booking: reservationExtended,
        productId: reservation.productId,
        optionId: reservation.optionId,
        availabilityId: reservation.availabilityId,
      }),
      ...new BookingValidator({
        capabilities: context.getCapabilityIDs(),
      }).validate(result.data),
    ];

    return this.handleResult({
      ...data,
      errors,
    });
  };
}
