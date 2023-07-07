import { addDays } from "date-fns";
import { DateHelper } from "../../../../helpers/DateHelper";
import { InvalidOptionIdErrorValidator } from "../../../../validators/backendValidator/Error/InvalidOptionIdErrorValidator";
import descriptions from "../../consts/descriptions";
import { Context } from "../../context/Context";
import { AvailabilityCalendarScenarioHelper } from "../../helpers/AvailabilityCalendarScenarioHelper";
import { Scenario, ScenarioResult } from "../Scenario";

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
    }, context);
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
