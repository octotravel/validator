import { Product } from "@octocloud/types";
import { Scenario } from "../Scenario";
import { AvailabilityScenarioHelper } from "../../helpers/AvailabilityScenarioHelper";
import { DateHelper } from "../../../../helpers/DateHelper";
import descriptions from "../../consts/descriptions";
import { Context } from "../../context/Context";

export class AvailabilityCheckDateScenario implements Scenario {
  private product: Product;
  private availabilityScenarioHelper = new AvailabilityScenarioHelper();

  constructor(product: Product) {
    this.product = product;
  }

  public validate = async (context: Context) => {
    const apiClient = context.getApiClient();
    const availability = context.productConfig.availability[this.product.availabilityType];
    
    const result = await apiClient.getAvailability({
      productId: this.product.id,
      optionId: this.product.options[0].id,
      localDate: DateHelper.getDate(availability.localDateTimeStart),
    }, context);
    const name = `Availability Check Date (${this.product.availabilityType})`;
    const description = descriptions.availabilityCheckDate;

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
