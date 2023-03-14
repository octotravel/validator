import { Product } from "@octocloud/types";
import { Scenario } from "../Scenario.ts";
import { AvailabilityScenarioHelper } from "../../helpers/AvailabilityScenarioHelper.ts";
import descriptions from "../../consts/descriptions.ts";
import { Context } from "../../context/Context.ts";
import { SubRequestMapper } from "../../../logging/SubRequestMapper.ts";

export class AvailabilityCheckAvailabilityIdScenario
  implements Scenario
{

  private product: Product;
  private availabilityScenarioHelper = new AvailabilityScenarioHelper();

  constructor(product: Product) {
    this.product = product;
  }

  public validate = async (context: Context) => {
    const apiClient = context.getApiClient();
    const availability =
      context.productConfig.availability[this.product.availabilityType];
    const date = new Date();
    const result = await apiClient.getAvailability({
      productId: this.product.id,
      optionId: this.product.options[0].id,
      availabilityIds: [availability.id],
    });

    const name = `Availability Check AvailabilityId (${this.product.availabilityType})`;
    const description = descriptions.availabilityCheckAvailabilityId;

    context.subrequestMapper.map(result, context, date);

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
