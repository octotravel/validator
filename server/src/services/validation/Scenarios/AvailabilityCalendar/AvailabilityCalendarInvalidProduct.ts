import { addDays } from "date-fns";
import { DateHelper } from "../../../../helpers/DateHelper";
import { InvalidProductIdErrorValidator } from "../../../../validators/backendValidator/Error/InvalidProductIdErrorValidator";
import descriptions from "../../consts/descriptions";
import { Context } from "../../context/Context";
import { AvailabilityCalendarScenarioHelper } from "../../helpers/AvailabilityCalendarScenarioHelper";
import { Scenario, ScenarioResult } from "../Scenario";

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
    
    const result = await apiClient.getAvailabilityCalendar({
      productId: context.invalidProductId,
      optionId: product.options[0].id,
      localDateStart: DateHelper.getDate(new Date().toISOString()),
      localDateEnd: DateHelper.getDate(addDays(new Date(), 30).toISOString()),
    }, context);

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
