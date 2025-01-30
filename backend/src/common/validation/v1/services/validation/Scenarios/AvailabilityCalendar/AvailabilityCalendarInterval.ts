import { Product } from '@octocloud/types';
import descriptions from '../../consts/descriptions';
import { Context } from '../../context/Context';
import { AvailabilityCalendarScenarioHelper } from '../../helpers/AvailabilityCalendarScenarioHelper';
import { Scenario, ScenarioResult } from '../Scenario';

export class AvailabilityCalendarIntervalScenario implements Scenario {
  private readonly product: Product;

  public constructor(product: Product) {
    this.product = product;
  }

  private readonly availabilityCalendarScenarioHelper = new AvailabilityCalendarScenarioHelper();

  public validate = async (context: Context): Promise<ScenarioResult> => {
    const apiClient = context.getApiClient();
    const option = this.product.options.find((o) => o.default) ?? this.product.options[0];

    const result = await apiClient.getAvailabilityCalendar(
      {
        productId: this.product.id,
        optionId: option.id,
        localDateStart: context.localDateStart,
        localDateEnd: context.localDateEnd,
      },
      context,
    );
    const name = `Availability Calendar Interval (${this.product.availabilityType})`;
    const description = descriptions.availabilityCalendarInterval;

    return this.availabilityCalendarScenarioHelper.validateAvailability(
      {
        result,
        name,
        description,
      },
      this.product,
      context,
    );
  };
}
