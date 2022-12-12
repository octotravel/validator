import { Scenario } from "../../Scenario.ts";
import { BookingExtendScenarioHelper } from "../../../helpers/BookingExtendScenarioHelper.ts";
import { InvalidBookingUUIDErrorValidator } from "../../../../../validators/backendValidator/Error/InvalidBookingUUIDErrorValidator.ts";
import { Config } from "../../../config/Config.ts";
import descriptions from "../../../consts/descriptions.ts";

export class BookingReservationExtendInvalidUUIDScenario
  implements Scenario
{
  private config = Config.getInstance();
  private apiClient = this.config.getApiClient();
  private bookingExtendScenarioHelper = new BookingExtendScenarioHelper();

  public validate = async () => {
    const name = "Extend Reservation Invalid UUID (INVALID_BOOKING_UUID).ts";
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
