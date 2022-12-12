import { Product } from "npm:@octocloud/types@^1.3.1";
import { Scenario } from "../Scenario.ts";
import { AvailabilityScenarioHelper } from "../../helpers/AvailabilityScenarioHelper.ts";
import { Config } from "../../config/Config.ts";
import descriptions from "../../consts/descriptions.ts";

export class AvailabilityChecIntervalScenario
  implements Scenario
{
  private config = Config.getInstance();
  private apiClient = this.config.getApiClient();

  private product: Product;
  private availabilityScenarioHelper = new AvailabilityScenarioHelper();

  constructor(product: Product) {
    this.product = product;
  }

  public validate = async () => {
    const result = await this.apiClient.getAvailability({
      productId: this.product.id,
      optionId: this.product.options[0].id,
      localDateStart: this.config.localDateStart,
      localDateEnd: this.config.localDateEnd,
    });

    const availabilities = result.data ?? [];
    const randomAvailability =
      availabilities[Math.floor(Math.random() * availabilities.length)];
    this.config.productConfig.addAvailabilityID = {
      availabilityType: this.product.availabilityType,
      availabilityID: randomAvailability.id,
    };
    const name = `Availability Check Interval (${this.product.availabilityType})`;
    const description = descriptions.availabilityCheckInterval;

    return this.availabilityScenarioHelper.validateAvailability(
      {
        name,
        result,
        description,
      },
      this.product
    );
  };
}
