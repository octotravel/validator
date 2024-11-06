import { Product } from '@octocloud/types';
import { Scenario, ScenarioResult } from '../Scenario';
import { AvailabilityScenarioHelper } from '../../helpers/AvailabilityScenarioHelper';
import descriptions from '../../consts/descriptions';
import { Context } from '../../context/Context';
import Prando from 'prando';

export class AvailabilityChecIntervalScenario implements Scenario {
  private readonly product: Product;
  private readonly availabilityScenarioHelper = new AvailabilityScenarioHelper();

  public constructor(product: Product) {
    this.product = product;
  }

  public validate = async (context: Context): Promise<ScenarioResult> => {
    const apiClient = context.getApiClient();

    const result = await apiClient.getAvailability(
      {
        productId: this.product.id,
        optionId: this.product.options[0].id,
        localDateStart: context.localDateStart,
        localDateEnd: context.localDateEnd,
      },
      context,
    );

    const availabilities = result.data ?? [];
    const randomAvailability =
      availabilities[new Prando(availabilities.length).nextInt(0, availabilities.length - 1)] ?? null;

    if (randomAvailability === null) {
      context.terminateValidation = true;
    }
    context.productConfig.addAvailability = {
      availabilityType: this.product.availabilityType,
      availability: randomAvailability,
    };
    const name = `Availability Check Interval (${this.product.availabilityType})`;
    const description = descriptions.availabilityCheckInterval;

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
