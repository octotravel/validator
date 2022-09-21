import { Scenario } from "../../Scenario";
import { BookingExtendScenarioHelper } from "../../../helpers/BookingExtendScenarioHelper";
import { InvalidBookingUUIDErrorValidator } from "../../../../../validators/backendValidator/Error/InvalidBookingUUIDErrorValidator";
import { Config } from "../../../config/Config";
import descriptions from "../../../consts/descriptions";

export class BookingReservationExtendInvalidUUIDScenario
  implements Scenario
{
  private config = Config.getInstance();
  private apiClient = this.config.getApiClient();
  private bookingExtendScenarioHelper = new BookingExtendScenarioHelper();

  public validate = async () => {
    const name = "Extend Reservation Invalid UUID (INVALID_BOOKING_UUID)";
    const description = descriptions.invalidUUID;
    const result = await this.apiClient.bookingExtend({
      uuid: this.config.invalidUUID,
      expirationMinutes: 31,
    });


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
