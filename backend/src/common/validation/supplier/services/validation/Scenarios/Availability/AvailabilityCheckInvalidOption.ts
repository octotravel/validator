import { InvalidOptionIdErrorValidator } from '../../../../validators/backendValidator/Error/InvalidOptionIdErrorValidator';
import descriptions from '../../consts/descriptions';
import { Context } from '../../context/Context';
import { AvailabilityScenarioHelper } from '../../helpers/AvailabilityScenarioHelper';
import { Scenario, ScenarioResult } from '../Scenario';

export class AvailabilityCheckInvalidOptionScenario implements Scenario {
  private readonly availabilityScenarioHelper = new AvailabilityScenarioHelper();

  public validate = async (context: Context): Promise<ScenarioResult> => {
    const apiClient = context.getApiClient();
    const [product] = context.productConfig.productsForAvailabilityCheck;

    const result = await apiClient.getAvailability(
      {
        productId: product.id,
        optionId: context.invalidOptionId,
        localDateStart: context.localDateStart,
        localDateEnd: context.localDateEnd,
      },
      context,
    );
    const name = 'Availability Check Invalid Option (400 INVALID_OPTION_ID)';
    const description = descriptions.invalidOption;

    return this.availabilityScenarioHelper.validateError(
      {
        name,
        result,
        description,
      },
      new InvalidOptionIdErrorValidator(),
    );
  };
}
