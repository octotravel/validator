import { InvalidProductIdErrorValidator } from '../../../../validators/backendValidator/Error/InvalidProductIdErrorValidator';
import descriptions from '../../consts/descriptions';
import { Context } from '../../context/Context';
import { ProductScenarioHelper } from '../../helpers/ProductScenarioHelper';
import { Scenario, ScenarioResult } from '../Scenario';

export class GetProductInvalidScenario implements Scenario {
  private readonly productScenarioHelper = new ProductScenarioHelper();

  public validate = async (context: Context): Promise<ScenarioResult> => {
    const apiClient = context.getApiClient();

    const result = await apiClient.getProduct(
      {
        id: context.invalidProductId,
      },
      context,
    );
    const name = 'Get Product Invalid (400 INVALID_PRODUCT_ID)';
    const description = descriptions.invalidProduct;

    return this.productScenarioHelper.validateError(
      {
        result,
        name,
        description,
      },
      new InvalidProductIdErrorValidator(),
    );
  };
}
