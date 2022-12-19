import { Product } from "https://esm.sh/@octocloud/types@1.3.1";
import { Scenario, ScenarioResult } from "../Scenario.ts";
import { AvailabilityCalendarScenarioHelper } from "../../helpers/AvailabilityCalendarScenarioHelper.ts";
import { Config } from "../../config/Config.ts";
import descriptions from "../../consts/descriptions.ts";

export class AvailabilityCalendarIntervalScenario implements Scenario {
  private config = Config.getInstance();
  private apiClient = this.config.getApiClient();
  private product: Product;

  constructor(product: Product) {
    this.product = product;
  }

  private availabilityCalendarScenarioHelper =
    new AvailabilityCalendarScenarioHelper();

  public validate = async (): Promise<ScenarioResult> => {
    const option =
      this.product.options.find((o) => o.default) ?? this.product.options[0];
    const result = await this.apiClient.getAvailabilityCalendar({
      productId: this.product.id,
      optionId: option.id,
      localDateStart: this.config.localDateStart,
      localDateEnd: this.config.localDateEnd,
    });
    const name = `Availability Calendar Interval (${this.product.availabilityType})`;
    const description = descriptions.availabilityCalendarInterval;

    return this.availabilityCalendarScenarioHelper.validateAvailability(
      {
        result,
        name,
        description,
      },
      this.product
    );
  };
}
