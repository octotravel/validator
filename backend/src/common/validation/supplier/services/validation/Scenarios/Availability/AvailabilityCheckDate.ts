import { Product } from '@octocloud/types';
import { DateHelper } from '../../../../helpers/DateHelper';
import descriptions from '../../consts/descriptions';
import { Context } from '../../context/Context';
import { AvailabilityScenarioHelper } from '../../helpers/AvailabilityScenarioHelper';
import { Scenario, ScenarioResult } from '../Scenario';

export class AvailabilityCheckDateScenario implements Scenario {
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
        localDateStart: DateHelper.getDate(availability.localDateTimeStart),
        localDateEnd: DateHelper.getDate(availability.localDateTimeEnd),
      },
      context,
    );
    const name = `Availability Check Date (${this.product.availabilityType})`;
    const description = descriptions.availabilityCheckDate;

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
