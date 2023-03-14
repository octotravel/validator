import { InvalidProductIdErrorValidator } from "../../../../validators/backendValidator/Error/InvalidProductIdErrorValidator.ts";
import { SubRequestMapper } from "../../../logging/SubRequestMapper.ts";
import descriptions from "../../consts/descriptions.ts";
import { Context } from "../../context/Context.ts";
import { AvailabilityScenarioHelper } from "../../helpers/AvailabilityScenarioHelper.ts";
import { Scenario, ScenarioResult } from "../Scenario.ts";

export class AvailabilityCheckInvalidProductScenario implements Scenario {
  private availabilityScenarioHelper = new AvailabilityScenarioHelper();

  public validate = async (context: Context): Promise<ScenarioResult> => {
    const apiClient = context.getApiClient();
    const [product] = context.productConfig.productsForAvailabilityCheck;
    const date = new Date();
    const result = await apiClient.getAvailability({
      productId: context.invalidProductId,
      optionId: product.options[0].id,
      localDateStart: context.localDateStart,
      localDateEnd: context.localDateEnd,
    });

    const name = `Availability Check Invalid Product (400 INVALID_PRODUCT_ID)`;
    const description = descriptions.invalidProduct;

    context.subrequestMapper.map(result, context, date);

    return this.availabilityScenarioHelper.validateError(
      {
        name,
        result,
        description,
      },
      new InvalidProductIdErrorValidator()
    );
  };
}
