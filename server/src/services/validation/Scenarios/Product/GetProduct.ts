import { Config } from "../../config/Config.ts";
import descriptions from "../../consts/descriptions.ts";
import { ProductScenarioHelper } from "../../helpers/ProductScenarioHelper.ts";
import { Scenario } from "../Scenario.ts";

export class GetProductScenario implements Scenario {
  private config = Config.getInstance();
  private apiClient = this.config.getApiClient();
  private productScenarioHelper = new ProductScenarioHelper();

  public validate = async () => {
    const product = this.config.getProduct();
    const result = await this.apiClient.getProduct({
      id: product.id,
    });
    const name = `Get Product`;
    const description = descriptions.getProduct;

    return this.productScenarioHelper.validateProduct({
      result,
      name,
      description,
    });
  };
}
