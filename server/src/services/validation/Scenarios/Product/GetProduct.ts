import { SubRequestMapper } from "../../../logging/SubRequestMapper.ts";
import descriptions from "../../consts/descriptions.ts";
import { Context } from "../../context/Context.ts";
import { ProductScenarioHelper } from "../../helpers/ProductScenarioHelper.ts";
import { Scenario } from "../Scenario.ts";

export class GetProductScenario implements Scenario {
  private productScenarioHelper = new ProductScenarioHelper();

  public validate = async (context: Context) => {
    const apiClient = context.getApiClient();
    const product = context.getProduct();
    const date = new Date();
    const result = await apiClient.getProduct({
      id: product.id,
    });
    const name = `Get Product`;
    const description = descriptions.getProduct;
    
    context.subrequestMapper.map(result, context, date);

    return this.productScenarioHelper.validateProduct({
      result,
      name,
      description,
    }, context);
  };
}
