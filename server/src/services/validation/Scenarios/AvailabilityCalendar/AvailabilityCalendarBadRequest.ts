import { AvailabilityCalendarBodySchema } from "npm:@octocloud/types@^1.3.1";
import { addDays } from "npm:date-fns@^2.29.1";
import { DateHelper } from "../../../../helpers/DateHelper.ts";
import { BadRequestErrorValidator } from "../../../../validators/backendValidator/Error/BadRequestErrorValidator.ts";
import { Config } from "../../config/Config.ts";
import descriptions from "../../consts/descriptions.ts";
import { AvailabilityCalendarScenarioHelper } from "../../helpers/AvailabilityCalendarScenarioHelper.ts";
import { Scenario, ScenarioResult } from "../Scenario.ts";

export class AvailabilityCalendarBadRequestScenario
  implements Scenario
{
  private config = Config.getInstance();
  private apiClient = this.config.getApiClient();
  private availabilityCalendarScenarioHelper =
    new AvailabilityCalendarScenarioHelper();

  public validate = async (): Promise<
    ScenarioResult
  > => {
    const product = this.config.getProduct();
    const result = await this.apiClient.getAvailabilityCalendar({
      productId: product.id,
      optionId: product.options[0].id,
      localDateEnd: DateHelper.getDate(addDays(new Date(), 30).toISOString()),
    } as AvailabilityCalendarBodySchema);

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
