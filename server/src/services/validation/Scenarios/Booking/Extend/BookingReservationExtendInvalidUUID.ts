import { Scenario } from "../../Scenario";
import { BookingExtendScenarioHelper } from "../../../helpers/BookingExtendScenarioHelper";
import { InvalidBookingUUIDErrorValidator } from "../../../../../validators/backendValidator/Error/InvalidBookingUUIDErrorValidator";
import descriptions from "../../../consts/descriptions";
import { Context } from "../../../context/Context";

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
