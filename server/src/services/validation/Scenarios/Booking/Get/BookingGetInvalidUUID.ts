import { Scenario } from "../../Scenario.ts";
import { InvalidBookingUUIDErrorValidator } from "../../../../../validators/backendValidator/Error/InvalidBookingUUIDErrorValidator.ts";
import { BookingGetScenarioHelper } from "../../../helpers/BookingGetScenarioHelper.ts";
import descriptions from "../../../consts/descriptions.ts";
import { Context } from "../../../context/Context.ts";
import { SubRequestMapper } from "../../../../logging/SubRequestMapper.ts";

export class BookingGetInvalidUUIDScenario implements Scenario {
  private bookingGetScenarioHelper = new BookingGetScenarioHelper();

  public validate = async (context: Context) => {
    const apiClient = context.getApiClient();
    const date = new Date();
    const result = await apiClient.getBooking({
      uuid: context.invalidUUID,
    });

    const name = "Get Booking Invalid Booking UUID (400 INVALID_BOOKING_UUID)";
    const description = descriptions.invalidUUID;

    context.subrequestMapper.map(result, context, date);

    return this.bookingGetScenarioHelper.validateError(
      {
        result,
        name,
        description,
      },
      new InvalidBookingUUIDErrorValidator()
    );
  };
}
