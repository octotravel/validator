import { BookingEndpointValidator } from "./../../../validators/backendValidator/Booking/BookingEndpointValidator.ts";
import { Booking, CreateBookingBodySchema } from "@octocloud/types";
import { BookingValidator } from "../../../validators/backendValidator/Booking/BookingValidator.ts";
import {
  ScenarioHelper,
  ScenarioHelperData,
} from "./ScenarioHelper.ts";
import { Context } from "../context/Context.ts";

export class BookingReservationScenarioHelper extends ScenarioHelper {
  private bookingEndpointValidator = new BookingEndpointValidator();

  public validateBookingReservation = (
    data: ScenarioHelperData<Booking>,
    context: Context
  ) => {
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
        schema: request?.body as CreateBookingBodySchema,
        reservation,
      }),
      ...this.bookingEndpointValidator.validate({
        booking: reservation,
        productId: request?.body?.productId,
        optionId: request?.body?.optionId,
        availabilityId: request?.body?.availabilityId,
      }),
      ...new BookingValidator({
        capabilities: context.getCapabilityIDs(),
      }).validate(result.data),
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
