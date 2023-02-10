import { Booking, UpdateBookingBodySchema } from "https://esm.sh/@octocloud/types@1.3.1";
import { BookingEndpointValidator } from "../../../validators/backendValidator/Booking/BookingEndpointValidator.ts";
import { BookingValidator } from "../../../validators/backendValidator/Booking/BookingValidator.ts";
import { Context } from "../context/Context.ts";
import { ScenarioHelper, ScenarioHelperData } from "./ScenarioHelper.ts";

export class BookingUpdateScenarioHelper extends ScenarioHelper {
  private bookingEndpointValidator = new BookingEndpointValidator();
  public validateBookingUpdate = (
    data: ScenarioHelperData<Booking>,
    booking: Booking,
    context: Context
  ) => {
    const { result } = data;
    const bookingUpdated = result?.data;
    const request = result?.request;
    const response = result?.response;
    const schema = request?.body as UpdateBookingBodySchema;
    if (response?.error) {
      return this.handleResult({
        ...data,
        success: false,
        errors: [],
      });
    }

    const errors = [
      ...this.bookingEndpointValidator.validateUpdate({
        booking,
        bookingUpdated,
        schema,
      }),
      ...this.bookingEndpointValidator.validate({
        booking: result.data,
        productId: schema.productId ?? booking.productId,
        optionId: schema.optionId ?? booking.optionId,
        availabilityId: schema.availabilityId ?? booking.availabilityId,
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
