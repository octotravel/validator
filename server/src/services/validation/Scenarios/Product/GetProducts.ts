import { Scenario } from "../Scenario.ts";
import { ProductScenarioHelper } from "../../helpers/ProductScenarioHelper.ts";
import descriptions from "../../consts/descriptions.ts";
import { Context } from "../../context/Context.ts";

export class GetProductsScenario implements Scenario {
  private productScenarioHelper = new ProductScenarioHelper();

  public validate = async (context: Context) => {
    const apiClient = context.getApiClient();
    
    const result = await apiClient.getProducts(context);
    const name = "Get Products";
    const description = descriptions.getProducts;

    return this.productScenarioHelper.validateProducts({
      result,
      name,
      description,
    },context);
  };
}
