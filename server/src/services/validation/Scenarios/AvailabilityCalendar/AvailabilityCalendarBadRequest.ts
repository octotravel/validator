import { AvailabilityCalendarBodySchema } from "https://esm.sh/@octocloud/types@1.5.2";
import { addDays } from "https://esm.sh/date-fns@2.29.1";
import { DateHelper } from "../../../../helpers/DateHelper.ts";
import { BadRequestErrorValidator } from "../../../../validators/backendValidator/Error/BadRequestErrorValidator.ts";
import descriptions from "../../consts/descriptions.ts";
import { Context } from "../../context/Context.ts";
import { AvailabilityCalendarScenarioHelper } from "../../helpers/AvailabilityCalendarScenarioHelper.ts";
import { Scenario, ScenarioResult } from "../Scenario.ts";

export class AvailabilityCalendarBadRequestScenario
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
      optionId: product.options[0].id,
      localDateEnd: DateHelper.getDate(addDays(new Date(), 30).toISOString()),
    } as AvailabilityCalendarBodySchema, context);

    const name = `Availability Calendar BAD_REQUEST (400 BAD_REQUEST)`;
    const description = descriptions.availabilityCalendarBadRequest;

    return this.availabilityCalendarScenarioHelper.validateError(
      {
        result,
        name,
        description,
      },
      new BadRequestErrorValidator()
    );
  };
}
