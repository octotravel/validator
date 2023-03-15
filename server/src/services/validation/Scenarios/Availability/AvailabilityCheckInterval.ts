import { Product } from "https://esm.sh/@octocloud/types@1.5.2";
import { Scenario } from "../Scenario.ts";
import { AvailabilityScenarioHelper } from "../../helpers/AvailabilityScenarioHelper.ts";
import descriptions from "../../consts/descriptions.ts";
import { Context } from "../../context/Context.ts";

export class AvailabilityChecIntervalScenario
  implements Scenario
{
  private product: Product;
  private availabilityScenarioHelper = new AvailabilityScenarioHelper();

  constructor(product: Product) {
    this.product = product;
  }

  public validate = async (context: Context) => {
    const apiClient = context.getApiClient();
    const result = await apiClient.getAvailability({
      productId: this.product.id,
      optionId: this.product.options[0].id,
      localDateStart: context.localDateStart,
      localDateEnd: context.localDateEnd,
    });

    const availabilities = result.data ?? [];
    const randomAvailability =
      availabilities[Math.floor(Math.random() * availabilities.length)] ?? null;

    if (randomAvailability === null) {
      context.terminateValidation = true
    }
    context.productConfig.addAvailability = {
      availabilityType: this.product.availabilityType,
      availability: randomAvailability
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
      context
    );
  };
}
