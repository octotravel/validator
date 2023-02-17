import { Booking } from "@octocloud/types";
import { GetBookingsSchema } from "../../../schemas/Booking.ts";
import { BookingEndpointValidator } from "../../../validators/backendValidator/Booking/BookingEndpointValidator.ts";
import { BookingValidator } from "../../../validators/backendValidator/Booking/BookingValidator.ts";
import { Context } from "../context/Context.ts";
import { ScenarioHelper, ScenarioHelperData } from "./ScenarioHelper.ts";

export class BookingListScenarioHelper extends ScenarioHelper {
  private bookingEndpointValidator = new BookingEndpointValidator();

  public validateBookingList = (data: ScenarioHelperData<Booking[]>, context: Context) => {
    const { result } = data;
    const bookings = result.data ?? [];
    const request = result?.request;
    const response = result?.response;
    const schema = request?.body as GetBookingsSchema | null;
    if (response?.error) {
      return this.handleResult({
        ...data,
        success: false,
        errors: [],
      });
    }
    const errors = [
      ...this.bookingEndpointValidator.validateGetBookings({
        bookings,
        schema,
      }),
      ...bookings
        .map(
          new BookingValidator({
            capabilities: context.getCapabilityIDs(),
          }).validate
        )
        .flat(),
    ];
    return this.handleResult({
      ...data,
      errors,
    });
  };
}
