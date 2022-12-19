import { Scenario } from "../Scenario.ts";
import { ProductScenarioHelper } from "../../helpers/ProductScenarioHelper.ts";
import { Config } from "../../config/Config.ts";
import descriptions from "../../consts/descriptions.ts";

export class GetProductsScenario implements Scenario {
  private config = Config.getInstance();
  private apiClient = this.config.getApiClient();

  private productScenarioHelper = new ProductScenarioHelper();

  public validate = async () => {
    const result = await this.apiClient.getProducts();
    const name = "Get Products";
    const description = descriptions.getProducts;

    return this.productScenarioHelper.validateProducts({
      result,
      name,
      description,
    });
  };
}
