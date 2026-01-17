import descriptions from '../../consts/descriptions';
import { Context } from '../../context/Context';
import { ProductScenarioHelper } from '../../helpers/ProductScenarioHelper';
import { Scenario, ScenarioResult } from '../Scenario';

export class GetProductsScenario implements Scenario {
  private readonly productScenarioHelper = new ProductScenarioHelper();

  public validate = async (context: Context): Promise<ScenarioResult> => {
    const apiClient = context.getApiClient();

    const result = await apiClient.getProducts(context);
    const name = 'Get Products';
    const description = descriptions.getProducts;

    return this.productScenarioHelper.validateProducts(
      {
        result,
        name,
        description,
      },
      context,
    );
  };
}
