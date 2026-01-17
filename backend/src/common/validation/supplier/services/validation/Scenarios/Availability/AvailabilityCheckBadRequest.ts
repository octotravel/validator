import { BadRequestErrorValidator } from '../../../../validators/backendValidator/Error/BadRequestErrorValidator';
import descriptions from '../../consts/descriptions';
import { Context } from '../../context/Context';
import { AvailabilityScenarioHelper } from '../../helpers/AvailabilityScenarioHelper';
import { Scenario, ScenarioResult } from '../Scenario';

export class AvailabilityCheckBadRequestScenario implements Scenario {
  private readonly availabilityScenarioHelper = new AvailabilityScenarioHelper();

  public validate = async (context: Context): Promise<ScenarioResult> => {
    const apiClient = context.getApiClient();
    const [product] = context.productConfig.productsForAvailabilityCheck;
    const availability = context.productConfig.availability[product.availabilityType];

    const result = await apiClient.getAvailability(
      {
        productId: product.id,
        optionId: product.options[0].id,
        localDateStart: context.localDateStart,
        localDateEnd: context.localDateEnd,
        availabilityIds: [availability.id],
      },
      context,
    );

    const name = 'Availability Check BAD_REQUEST (400 BAD_REQUEST)';
    const description = descriptions.availabilityCheckBadRequest;

    return this.availabilityScenarioHelper.validateError(
      {
        name,
        result,
        description,
      },
      new BadRequestErrorValidator(),
    );
  };
}
