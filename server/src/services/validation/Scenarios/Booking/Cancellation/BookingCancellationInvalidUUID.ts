import { Scenario } from "../../Scenario.ts";
import { InvalidBookingUUIDErrorValidator } from "../../../../../validators/backendValidator/Error/InvalidBookingUUIDErrorValidator.ts";
import { BookingCancellationScenarioHelper } from "../../../helpers/BookingCancellationScenarioHelper.ts";
import descriptions from "../../../consts/descriptions.ts";
import { Context } from "../../../context/Context.ts";
import { SubRequestMapper } from "../../../../logging/SubRequestMapper.ts";

export class BookingCancellationInvalidUUIDScenario implements Scenario {
  private bookingCancellationScenarioHelper =
    new BookingCancellationScenarioHelper();

  public validate = async (context: Context) => {
    const apiClient = context.getApiClient();
    const date = new Date();
    const result = await apiClient.cancelBooking({
      uuid: context.invalidUUID,
    });

    const name =
      "Booking Cancellation Invalid Booking UUID (400 INVALID_BOOKING_UUID)";
    const description = descriptions.invalidUUID;

    context.subrequestMapper.map(result, context, date);

    return this.bookingCancellationScenarioHelper.validateError(
      {
        result,
        name,
        description,
      },
      new InvalidBookingUUIDErrorValidator()
    );
  };
}
