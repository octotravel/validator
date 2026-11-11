import { InvalidProductIdErrorValidator } from '../../../../validators/backendValidator/Error/InvalidProductIdErrorValidator';
import descriptions from '../../consts/descriptions';
import { Context } from '../../context/Context';
import { AvailabilityScenarioHelper } from '../../helpers/AvailabilityScenarioHelper';
import { Scenario, ScenarioResult } from '../Scenario';

export class AvailabilityCheckInvalidProductScenario implements Scenario {
  private readonly availabilityScenarioHelper = new AvailabilityScenarioHelper();

  public validate = async (context: Context): Promise<ScenarioResult> => {
    const apiClient = context.getApiClient();
    const [product] = context.productConfig.productsForAvailabilityCheck;

    const result = await apiClient.getAvailability(
      {
        productId: context.invalidProductId,
        optionId: product.options[0].id,
        localDateStart: context.getLocalDateStart(product),
        localDateEnd: context.getLocalDateEnd(product),
      },
      context,
    );

    const name = 'Availability Check Invalid Product (400 INVALID_PRODUCT_ID)';
    const description = descriptions.invalidProduct;

    return this.availabilityScenarioHelper.validateError(
      {
        name,
        result,
        description,
      },
      new InvalidProductIdErrorValidator(),
    );
  };
}
