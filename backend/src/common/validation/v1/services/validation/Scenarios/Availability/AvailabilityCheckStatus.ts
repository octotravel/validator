import { Availability, Product } from '@octocloud/types';
import { Result } from '../../api/types';
import { Context } from '../../context/Context';
import { AvailabilityStatusScenarioHelper } from '../../helpers/AvailabilityStatusScenarioHelper';
import { Scenario, ScenarioResult } from '../Scenario';

interface FetchAvailabilityResult {
  result: Result<Availability[]>;
  product: Product;
}

export class AvailabilityCheckStatusScenario implements Scenario {
  private readonly products: Product[];
  private readonly availabilityStatusScenarioHelper = new AvailabilityStatusScenarioHelper();

  public constructor(products: Product[]) {
    this.products = products;
  }

  public validate = async (context: Context): Promise<ScenarioResult> => {
    const availabilityType = this.products[0].availabilityType;
    const name = `Availability Check Status ${availabilityType}`;
    const products = await this.fetchAvailabilityForProducts(this.products, context);

    return this.availabilityStatusScenarioHelper.validateAvailability(
      {
        name,
        products,
      },
      context,
    );
  };

  private readonly fetchAvailabilityForProducts = async (
    products: Product[],
    context: Context,
  ): Promise<FetchAvailabilityResult[]> => {
    const apiClient = context.getApiClient();
    return await Promise.all(
      products.map(async (product) => {
        const option = product.options.find((option) => option.default) ?? product.options[0];
        const result = await apiClient.getAvailability(
          {
            productId: product.id,
            optionId: option.id,
            localDateStart: context.localDateStart,
            localDateEnd: context.localDateEnd,
          },
          context,
        );

        return {
          result,
          product,
        };
      }),
    );
  };
}
