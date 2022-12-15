import { InvalidProductIdErrorValidator } from "../../../../validators/backendValidator/Error/InvalidProductIdErrorValidator.ts";
import { Config } from "../../config/Config.ts";
import descriptions from "../../consts/descriptions.ts";
import { ProductScenarioHelper } from "../../helpers/ProductScenarioHelper.ts";
import { Scenario } from "../Scenario.ts";

export class GetProductInvalidScenario implements Scenario {
  private config = Config.getInstance();
  private apiClient = this.config.getApiClient();
  private productScenarioHelper = new ProductScenarioHelper();

  public validate = async () => {
    const result = await this.apiClient.getProduct({
      id: this.config.invalidProductId,
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
