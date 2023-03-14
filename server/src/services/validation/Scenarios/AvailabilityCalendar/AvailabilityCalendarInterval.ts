import { Product } from "@octocloud/types";
import { Scenario, ScenarioResult } from "../Scenario.ts";
import { AvailabilityCalendarScenarioHelper } from "../../helpers/AvailabilityCalendarScenarioHelper.ts";
import descriptions from "../../consts/descriptions.ts";
import { Context } from "../../context/Context.ts";
import { SubRequestMapper } from "../../../logging/SubRequestMapper.ts";

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
    const date = new Date();
    const result = await apiClient.getAvailabilityCalendar({
      productId: this.product.id,
      optionId: option.id,
      localDateStart: context.localDateStart,
      localDateEnd: context.localDateEnd,
    });
    const name = `Availability Calendar Interval (${this.product.availabilityType})`;
    const description = descriptions.availabilityCalendarInterval;

    context.subrequestMapper.map(result, context, date);

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
