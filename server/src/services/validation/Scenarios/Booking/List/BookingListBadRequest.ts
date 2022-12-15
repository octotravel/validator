import { Scenario } from "../../Scenario.ts";
import { BookingListScenarioHelper } from "../../../helpers/BookingListScenarioHelper.ts";
import { BadRequestErrorValidator } from "../../../../../validators/backendValidator/Error/BadRequestErrorValidator.ts";
import { Config } from "../../../config/Config.ts";
import descriptions from "../../../consts/descriptions.ts";

export class BookingListBadRequestScenario implements Scenario {
  private config = Config.getInstance();
  private apiClient = this.config.getApiClient();

  private bookingListScenarioHelper = new BookingListScenarioHelper();

  public validate = async () => {
    const result = await this.apiClient.getBookings({});

    const name = "List Bookings BAD_REQUEST (400 BAD_REQUEST).ts";
    const description = descriptions.bookingListBadRequest;

    return this.bookingListScenarioHelper.validateError(
      {
        result,
        name,
        description,
      },
      new BadRequestErrorValidator()
    );
  };
}
