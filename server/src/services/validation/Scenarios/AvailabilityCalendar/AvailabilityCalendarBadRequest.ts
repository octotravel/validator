import { AvailabilityCalendarBodySchema } from "@octocloud/types";
import { addDays } from "date-fns";
import { DateHelper } from "../../../../helpers/DateHelper";
import { BadRequestErrorValidator } from "../../../../validators/backendValidator/Error/BadRequestErrorValidator";
import descriptions from "../../consts/descriptions";
import { Context } from "../../context/Context";
import { AvailabilityCalendarScenarioHelper } from "../../helpers/AvailabilityCalendarScenarioHelper";
import { Scenario, ScenarioResult } from "../Scenario";

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
