import { Scenario } from "../../Scenario.ts";
import { InvalidBookingUUIDErrorValidator } from "../../../../../validators/backendValidator/Error/InvalidBookingUUIDErrorValidator.ts";
import { BookingConfirmationScenarioHelper } from "../../../helpers/BookingConfirmationScenarioHelper.ts";
import descriptions from "../../../consts/descriptions.ts";
import { Context } from "../../../context/Context.ts";
import { SubRequestMapper } from "../../../../logging/SubRequestMapper.ts";

export class BookingConfirmationInvalidUUIDScenario implements Scenario {
  private bookingConfirmationScenarioHelper =
    new BookingConfirmationScenarioHelper();

  public validate = async (context: Context) => {
    const apiClient = context.getApiClient();
    const date = new Date();
    const result = await apiClient.bookingConfirmation({
      uuid: context.invalidUUID,
      contact: {},
    });

    const name =
      "Booking Confirmation Invalid Booking UUID (400 INVALID_BOOKING_UUID)";
    const description = descriptions.invalidUUID;

    context.subrequestMapper.map(result, context, date);

    return this.bookingConfirmationScenarioHelper.validateError(
      {
        result,
        name,
        description,
      },
      new InvalidBookingUUIDErrorValidator()
    );
  };
}
