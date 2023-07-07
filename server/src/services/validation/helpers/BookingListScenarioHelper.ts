import { Booking } from "@octocloud/types";
import { GetBookingsSchema } from "../../../schemas/Booking";
import { BookingEndpointValidator } from "../../../validators/backendValidator/Booking/BookingEndpointValidator";
import { BookingValidator } from "../../../validators/backendValidator/Booking/BookingValidator";
import { Context } from "../context/Context";
import { ScenarioHelper, ScenarioHelperData } from "./ScenarioHelper";

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
