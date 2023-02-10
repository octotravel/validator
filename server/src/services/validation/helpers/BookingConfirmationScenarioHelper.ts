import { Booking, ConfirmBookingBodySchema } from "https://esm.sh/@octocloud/types@1.3.1";
import { BookingEndpointValidator } from "../../../validators/backendValidator/Booking/BookingEndpointValidator.ts";
import { BookingValidator } from "../../../validators/backendValidator/Booking/BookingValidator.ts";
import { Context } from "../context/Context.ts";
import {
  ScenarioHelper,
  ScenarioHelperData,
} from "./ScenarioHelper.ts";

export class BookingConfirmationScenarioHelper extends ScenarioHelper {
  private bookingEndpointValidator = new BookingEndpointValidator();

  public validateBookingConfirmation = (
    data: ScenarioHelperData<Booking>,
    reservation: Booking,
    context: Context
  ) => {
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
        schema: request?.body as ConfirmBookingBodySchema,
      }),
      ...this.bookingEndpointValidator.validate({
        booking,
        productId: reservation.productId,
        optionId: reservation.optionId,
        availabilityId: reservation.availabilityId,
      }),
      ...new BookingValidator({
        capabilities: context.getCapabilityIDs(),
      }).validate(booking),
    ];

    if (!this.isSuccess(errors)) {
      context.terminateValidation = true;
    }
    return this.handleResult({
      ...data,
      errors,
    });
  };
}
