import { Product } from '@octocloud/types';
import descriptions from '../../consts/descriptions';
import { Context } from '../../context/Context';
import { AvailabilityScenarioHelper } from '../../helpers/AvailabilityScenarioHelper';
import { Scenario, ScenarioResult } from '../Scenario';

export class AvailabilityCheckAvailabilityIdScenario implements Scenario {
  private readonly product: Product;
  private readonly availabilityScenarioHelper = new AvailabilityScenarioHelper();

  public constructor(product: Product) {
    this.product = product;
  }

  public validate = async (context: Context): Promise<ScenarioResult> => {
    const apiClient = context.getApiClient();
    const availability = context.productConfig.availability[this.product.availabilityType];

    const result = await apiClient.getAvailability(
      {
        productId: this.product.id,
        optionId: this.product.options[0].id,
        availabilityIds: [availability.id],
      },
      context,
    );

    const name = `Availability Check AvailabilityId (${this.product.availabilityType})`;
    const description = descriptions.availabilityCheckAvailabilityId;

    return this.availabilityScenarioHelper.validateAvailability(
      {
        name,
        result,
        description,
      },
      this.product,
      context,
    );
  };
}
