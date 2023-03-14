import { Scenario } from "../../Scenario.ts";
import { BookingListScenarioHelper } from "../../../helpers/BookingListScenarioHelper.ts";
import { BadRequestErrorValidator } from "../../../../../validators/backendValidator/Error/BadRequestErrorValidator.ts";
import descriptions from "../../../consts/descriptions.ts";
import { Context } from "../../../context/Context.ts";
import { SubRequestMapper } from "../../../../logging/SubRequestMapper.ts";

export class BookingListBadRequestScenario implements Scenario {
  private bookingListScenarioHelper = new BookingListScenarioHelper();

  public validate = async (context: Context) => {
    const apiClient = context.getApiClient();
    const date = new Date();
    const result = await apiClient.getBookings({});

    const name = "List Bookings BAD_REQUEST (400 BAD_REQUEST)";
    const description = descriptions.bookingListBadRequest;

    context.subrequestMapper.map(result, context, date);

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
