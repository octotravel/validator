import { Product } from "https://esm.sh/@octocloud/types@1.3.1";
import { Scenario, ScenarioResult } from "../Scenario.ts";
import { AvailabilityCalendarScenarioHelper } from "../../helpers/AvailabilityCalendarScenarioHelper.ts";
import descriptions from "../../consts/descriptions.ts";
import { Context } from "../../context/Context.ts";

export class AvailabilityCalendarIntervalScenario implements Scenario {
  private product: Product;

  constructor(product: Product) {
    this.product = product;
  }

  private availabilityCalendarScenarioHelper =
    new AvailabilityCalendarScenarioHelper();

  public validate = async (context: Context): Promise<ScenarioResult> => {
    const apiClient = context.getApiClient();
    const option =
      this.product.options.find((o) => o.default) ?? this.product.options[0];
    const result = await apiClient.getAvailabilityCalendar({
      productId: this.product.id,
      optionId: option.id,
      localDateStart: context.localDateStart,
      localDateEnd: context.localDateEnd,
    });
    const name = `Availability Calendar Interval (${this.product.availabilityType})`;
    const description = descriptions.availabilityCalendarInterval;

    return this.availabilityCalendarScenarioHelper.validateAvailability(
      {
        result,
        name,
        description,
      },
      this.product,
      context
    );
  };
}
