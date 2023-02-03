import { InvalidOptionIdErrorValidator } from "../../../../validators/backendValidator/Error/InvalidOptionIdErrorValidator.ts";
import descriptions from "../../consts/descriptions.ts";
import { Context } from "../../context/Context.ts";
import { AvailabilityScenarioHelper } from "../../helpers/AvailabilityScenarioHelper.ts";
import { Scenario, ScenarioResult } from "../Scenario.ts";

export class AvailabilityCheckInvalidOptionScenario implements Scenario {
  private availabilityScenarioHelper = new AvailabilityScenarioHelper();

  public validate = async (context: Context): Promise<ScenarioResult> => {
    const apiClient = context.getApiClient();
    const [product] = context.productConfig.productsForAvailabilityCheck;
    const result = await apiClient.getAvailability({
      productId: product.id,
      optionId: context.invalidOptionId,
      localDateStart: context.localDateStart,
      localDateEnd: context.localDateEnd,
    });
    const name = `Availability Check Invalid Option (400 INVALID_OPTION_ID)`;
    const description = descriptions.invalidOption;

    return this.availabilityScenarioHelper.validateError(
      {
        name,
        result,
        description,
      },
      new InvalidOptionIdErrorValidator()
    );
  };
}
