import { addDays } from "https://esm.sh/date-fns@2.29.1";
import { DateHelper } from "../../../../helpers/DateHelper.ts";
import { InvalidOptionIdErrorValidator } from "../../../../validators/backendValidator/Error/InvalidOptionIdErrorValidator.ts";
import descriptions from "../../consts/descriptions.ts";
import { Context } from "../../context/Context.ts";
import { AvailabilityCalendarScenarioHelper } from "../../helpers/AvailabilityCalendarScenarioHelper.ts";
import { Scenario, ScenarioResult } from "../Scenario.ts";

export class AvailabilityCalendarInvalidOptionScenario
  implements Scenario
{
  private availabilityCalendarScenarioHelper =
    new AvailabilityCalendarScenarioHelper();

  public validate = async (context: Context): Promise<
    ScenarioResult
  > => {
    const apiClient = context.getApiClient();
    const product = context.getProduct();
    const result = await apiClient.getAvailabilityCalendar({
      productId: product.id,
      optionId: context.invalidOptionId,
      localDateStart: DateHelper.getDate(new Date().toISOString()),
      localDateEnd: DateHelper.getDate(addDays(new Date(), 30).toISOString()),
    });
    const name = `Availability Calendar Invalid Option (400 INVALID_OPTION_ID)`;
    const description = descriptions.invalidOption;

    return this.availabilityCalendarScenarioHelper.validateError(
      {
        result,
        name,
        description,
      },
      new InvalidOptionIdErrorValidator()
    );
  };
}
