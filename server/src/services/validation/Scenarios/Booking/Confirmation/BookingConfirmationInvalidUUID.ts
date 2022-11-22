import { Scenario } from "../../Scenario";
import { InvalidBookingUUIDErrorValidator } from "../../../../../validators/backendValidator/Error/InvalidBookingUUIDErrorValidator";
import { BookingConfirmationScenarioHelper } from "../../../helpers/BookingConfirmationScenarioHelper";
import { Config } from "../../../config/Config";
import descriptions from "../../../consts/descriptions";

export class BookingConfirmationInvalidUUIDScenario implements Scenario {
  private config = Config.getInstance();
  private apiClient = this.config.getApiClient();

  private bookingConfirmationScenarioHelper =
    new BookingConfirmationScenarioHelper();

  public validate = async () => {
    const result = await this.apiClient.bookingConfirmation({
      uuid: this.config.invalidUUID,
      contact: {},
    });

    const name =
      "Booking Confirmation Invalid Booking UUID (400 INVALID_BOOKING_UUID)";
    const description = descriptions.invalidUUID;

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
