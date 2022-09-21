import { InvalidProductIdErrorValidator } from "../../../../validators/backendValidator/Error/InvalidProductIdErrorValidator";
import { Config } from "../../config/Config";
import descriptions from "../../consts/descriptions";
import { ProductScenarioHelper } from "../../helpers/ProductScenarioHelper";
import { Scenario } from "../Scenario";

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
