import { InvalidOptionIdErrorValidator } from "../../../../validators/backendValidator/Error/InvalidOptionIdErrorValidator.ts";
import { Config } from "../../config/Config.ts";
import descriptions from "../../consts/descriptions.ts";
import { AvailabilityScenarioHelper } from "../../helpers/AvailabilityScenarioHelper.ts";
import { Scenario, ScenarioResult } from "../Scenario.ts";

export class AvailabilityCheckInvalidOptionScenario implements Scenario {
  private config = Config.getInstance();
  private apiClient = this.config.getApiClient();
  private availabilityScenarioHelper = new AvailabilityScenarioHelper();

  public validate = async (): Promise<ScenarioResult> => {
    const [product] = this.config.productConfig.productsForAvailabilityCheck;
    const result = await this.apiClient.getAvailability({
      productId: product.id,
      optionId: this.config.invalidOptionId,
      localDateStart: this.config.localDateStart,
      localDateEnd: this.config.localDateEnd,
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
