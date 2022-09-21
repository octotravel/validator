import { CapabilityId } from "@octocloud/types";
import { Scenario } from "../../Scenario";
import { InvalidBookingUUIDErrorValidator } from "../../../../../validators/backendValidator/Error/InvalidBookingUUIDErrorValidator";
import { BookingGetScenarioHelper } from "../../../helpers/BookingGetScenarioHelper";
import { Config } from "../../../config/Config";
import descriptions from "../../../consts/descriptions";

export class BookingGetInvalidUUIDScenario implements Scenario {
  private config = Config.getInstance();
  private apiClient = this.config.getApiClient();
  private uuid: string;
  constructor({ uuid }: { uuid: string; capabilities: CapabilityId[] }) {
    this.uuid = uuid;
  }
  private bookingGetScenarioHelper = new BookingGetScenarioHelper();

  public validate = async () => {
    const result = await this.apiClient.getBooking({
      uuid: this.uuid,
    });

    const name = "Get Booking Invalid Booking UUID (400 INVALID_BOOKING_UUID)";
    const description = descriptions.invalidUUID;

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
