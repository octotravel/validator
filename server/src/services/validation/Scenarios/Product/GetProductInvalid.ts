import { InvalidProductIdErrorValidator } from "../../../../validators/backendValidator/Error/InvalidProductIdErrorValidator.ts";
import descriptions from "../../consts/descriptions.ts";
import { Context } from "../../context/Context.ts";
import { ProductScenarioHelper } from "../../helpers/ProductScenarioHelper.ts";
import { Scenario } from "../Scenario.ts";

export class GetProductInvalidScenario implements Scenario {
  private productScenarioHelper = new ProductScenarioHelper();

  public validate = async (context: Context) => {
    const apiClient = context.getApiClient();
    const result = await apiClient.getProduct({
      id: context.invalidProductId,
    });
    const name = `Get Product Invalid (400 INVALID_PRODUCT_ID)`;
    const description = descriptions.invalidProduct;

    return this.productScenarioHelper.validateError(
      {
        result,
        name,
        description,
      },
      new InvalidProductIdErrorValidator()
    );
  };
}
