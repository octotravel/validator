import { DateHelper } from "../../../../helpers/DateHelper.ts";
import { BadRequestErrorValidator } from "../../../../validators/backendValidator/Error/BadRequestErrorValidator.ts";
import { Config } from "../../config/Config.ts";
import descriptions from "../../consts/descriptions.ts";
import { AvailabilityScenarioHelper } from "../../helpers/AvailabilityScenarioHelper.ts";
import { Scenario, ScenarioResult } from "../Scenario.ts";

export class AvailabilityCheckBadRequestScenario
  implements Scenario
{
  private config = Config.getInstance();
  private apiClient = this.config.getApiClient();
  private availabilityScenarioHelper = new AvailabilityScenarioHelper();

  public validate = async (): Promise<ScenarioResult> => {
    const [product] = this.config.productConfig.productsForAvailabilityCheck;
    const availability =
      this.config.productConfig.availability[product.availabilityType];
    const result = await this.apiClient.getAvailability({
      productId: product.id,
      optionId: product.options[0].id,
      localDateStart: this.config.localDateStart,
      localDateEnd: this.config.localDateEnd,
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
