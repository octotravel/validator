import { addDays } from "https://esm.sh/date-fns@2.29.1";
import { DateHelper } from "../../../../helpers/DateHelper.ts";
import { InvalidProductIdErrorValidator } from "../../../../validators/backendValidator/Error/InvalidProductIdErrorValidator.ts";
import { SubRequestMapper } from "../../../logging/SubRequestMapper.ts";
import descriptions from "../../consts/descriptions.ts";
import { Context } from "../../context/Context.ts";
import { AvailabilityCalendarScenarioHelper } from "../../helpers/AvailabilityCalendarScenarioHelper.ts";
import { Scenario, ScenarioResult } from "../Scenario.ts";

export class AvailabilityCalendarInvalidProductScenario
  implements Scenario
{
  private availabilityCalendarScenarioHelper =
    new AvailabilityCalendarScenarioHelper();

  public validate = async (context: Context): Promise<
    ScenarioResult
  > => {
    const apiClient = context.getApiClient();
    const product = context.getProduct();
    const date = new Date();
    const result = await apiClient.getAvailabilityCalendar({
      productId: context.invalidProductId,
      optionId: product.options[0].id,
      localDateStart: DateHelper.getDate(new Date().toISOString()),
      localDateEnd: DateHelper.getDate(addDays(new Date(), 30).toISOString()),
    });

    const name = `Availability Calendar Invalid Product (400 INVALID_PRODUCT_ID)`;
    const description = descriptions.invalidProduct;

    context.subrequestMapper.map(result, context, date);

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
