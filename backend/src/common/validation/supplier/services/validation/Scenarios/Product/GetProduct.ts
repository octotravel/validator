import descriptions from '../../consts/descriptions';
import { Context } from '../../context/Context';
import { ProductScenarioHelper } from '../../helpers/ProductScenarioHelper';
import { Scenario, ScenarioResult } from '../Scenario';

export class GetProductScenario implements Scenario {
  private readonly productScenarioHelper = new ProductScenarioHelper();

  public validate = async (context: Context): Promise<ScenarioResult> => {
    const apiClient = context.getApiClient();
    const product = context.getProduct();

    const result = await apiClient.getProduct(
      {
        id: product.id,
      },
      context,
    );
    const name = 'Get Product';
    const description = descriptions.getProduct;

    return this.productScenarioHelper.validateProduct(
      {
        result,
        name,
        description,
      },
      context,
    );
  };
}
