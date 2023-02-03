import { DateHelper } from "../../../../helpers/DateHelper.ts";
import { BadRequestErrorValidator } from "../../../../validators/backendValidator/Error/BadRequestErrorValidator.ts";
import descriptions from "../../consts/descriptions.ts";
import { Context } from "../../context/Context.ts";
import { AvailabilityScenarioHelper } from "../../helpers/AvailabilityScenarioHelper.ts";
import { Scenario, ScenarioResult } from "../Scenario.ts";

export class AvailabilityCheckBadRequestScenario
  implements Scenario
{
  private availabilityScenarioHelper = new AvailabilityScenarioHelper();

  public validate = async (context: Context): Promise<ScenarioResult> => {
    const apiClient = context.getApiClient();
    const [product] = context.productConfig.productsForAvailabilityCheck;
    const availability =
      context.productConfig.availability[product.availabilityType];
    const result = await apiClient.getAvailability({
      productId: product.id,
      optionId: product.options[0].id,
      localDateStart: context.localDateStart,
      localDateEnd: context.localDateEnd,
      localDate: DateHelper.getDate(availability.localDateTimeStart),
      availabilityIds: [availability.id],
    });

    const name = `Availability Check BAD_REQUEST (400 BAD_REQUEST)`;
    const description = descriptions.availabilityCheckBadRequest;
    return this.availabilityScenarioHelper.validateError(
      {
        name,
        result,
        description,
      },
      new BadRequestErrorValidator()
    );
  };
}
