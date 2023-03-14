import descriptions from "../../consts/descriptions.ts";
import { Context } from "../../context/Context.ts";
import { ProductScenarioHelper } from "../../helpers/ProductScenarioHelper.ts";
import { Scenario } from "../Scenario.ts";

export class GetProductScenario implements Scenario {
  private productScenarioHelper = new ProductScenarioHelper();

  public validate = async (context: Context) => {
    const apiClient = context.getApiClient();
    const product = context.getProduct();
    
    const result = await apiClient.getProduct({
      id: product.id,
    }, context);
    const name = `Get Product`;
    const description = descriptions.getProduct;
    
    return this.productScenarioHelper.validateProduct({
      result,
      name,
      description,
    }, context);
  };
}
