import { Scenario } from "../Scenario.ts";
import { AvailabilityStatusScenarioHelper } from "../../helpers/AvailabilityStatusScenarioHelper.ts";
import { Product } from "https://esm.sh/@octocloud/types@1.5.2";
import { Context } from "../../context/Context.ts";

export class AvailabilityCheckStatusScenario implements Scenario {
  private products: Product[];
  private availabilityStatusScenarioHelper =
    new AvailabilityStatusScenarioHelper();

  constructor(products: Product[]) {
    this.products = products;
  }

  public validate = async (context: Context) => {
    const availabilityType = this.products[0].availabilityType;
    const name = `Availability Check Status ${availabilityType}`;
    const products = await this.fetchAvailabilityForProducts(this.products, context);
    return this.availabilityStatusScenarioHelper.validateAvailability({
      name,
      products,
    }, context);
  };

  private fetchAvailabilityForProducts = async (products: Product[], context: Context) => {
    const apiClient = context.getApiClient();
    return Promise.all(
      products.map(async (product) => {
        const option =
          product.options.find((option) => option.default) ??
          product.options[0];
        const result = await apiClient.getAvailability({
          productId: product.id,
          optionId: option.id,
          localDateStart: context.localDateStart,
          localDateEnd: context.localDateEnd,
        });
        return {
          result,
          product,
        };
      })
    );
  };
}
