import { addDays } from "npm:date-fns@^2.29.1";
import { DateHelper } from "../../../../helpers/DateHelper.ts";
import { InvalidProductIdErrorValidator } from "../../../../validators/backendValidator/Error/InvalidProductIdErrorValidator.ts";
import { Config } from "../../config/Config.ts";
import descriptions from "../../consts/descriptions.ts";
import { AvailabilityCalendarScenarioHelper } from "../../helpers/AvailabilityCalendarScenarioHelper.ts";
import { Scenario, ScenarioResult } from "../Scenario.ts";

export class AvailabilityCalendarInvalidProductScenario
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
      productId: this.config.invalidProductId,
      optionId: product.options[0].id,
      localDateStart: DateHelper.getDate(new Date().toISOString()),
      localDateEnd: DateHelper.getDate(addDays(new Date(), 30).toISOString()),
    });

    const name = `Availability Calendar Invalid Product (400 INVALID_PRODUCT_ID)`;
    const description = descriptions.invalidProduct;

    return this.availabilityCalendarScenarioHelper.validateError(
      {
        result,
        name,
        description,
      },
      new InvalidProductIdErrorValidator()
    );
  };
}
