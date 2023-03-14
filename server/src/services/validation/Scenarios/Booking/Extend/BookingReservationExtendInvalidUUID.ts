import { Scenario } from "../../Scenario.ts";
import { BookingExtendScenarioHelper } from "../../../helpers/BookingExtendScenarioHelper.ts";
import { InvalidBookingUUIDErrorValidator } from "../../../../../validators/backendValidator/Error/InvalidBookingUUIDErrorValidator.ts";
import descriptions from "../../../consts/descriptions.ts";
import { Context } from "../../../context/Context.ts";

export class BookingReservationExtendInvalidUUIDScenario
  implements Scenario
{
  private bookingExtendScenarioHelper = new BookingExtendScenarioHelper();

  public validate = async (context: Context) => {
    const apiClient = context.getApiClient();
    const name = "Extend Reservation Invalid UUID (INVALID_BOOKING_UUID)";
    const description = descriptions.invalidUUID;
    
    const result = await apiClient.bookingExtend({
      uuid: context.invalidUUID,
      expirationMinutes: 31,
    }, context);

    return this.bookingExtendScenarioHelper.validateError(
      {
        result,
        name,
        description,
      },
      new InvalidBookingUUIDErrorValidator()
    );
  };
}
