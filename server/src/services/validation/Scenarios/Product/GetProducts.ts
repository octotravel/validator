import { Scenario } from "../Scenario.ts";
import { ProductScenarioHelper } from "../../helpers/ProductScenarioHelper.ts";
import descriptions from "../../consts/descriptions.ts";
import { Context } from "../../context/Context.ts";
import { SubRequestMapper } from "../../../logging/SubRequestMapper.ts";

export class GetProductsScenario implements Scenario {
  private productScenarioHelper = new ProductScenarioHelper();

  public validate = async (context: Context) => {
    const apiClient = context.getApiClient();
    const date = new Date();
    const result = await apiClient.getProducts();
    const name = "Get Products";
    const description = descriptions.getProducts;

    context.subrequestMapper.map(result, context, date);

    return this.productScenarioHelper.validateProducts({
      result,
      name,
      description,
    },context);
  };
}
