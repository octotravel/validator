import { Availability, AvailabilityStatus, Product } from '@octocloud/types';
import * as R from 'ramda';
import { ErrorType, ValidatorError } from '../../../validators/backendValidator/ValidatorHelpers';
import { ScenarioResult } from '../Scenarios/Scenario';
import { Result } from '../api/types';
import descriptions from '../consts/descriptions';
import { Context, ErrorResult } from '../context/Context';
import { ProductBookable } from '../context/ProductBookable';
import { ScenarioHelper } from './ScenarioHelper';

export interface AvailabilityScenarioData {
  name: string;
  products: ProductResults[];
}

interface ProductResults {
  result: Result<Availability[]>;
  product: Product;
}

export class AvailabilityStatusScenarioHelper extends ScenarioHelper {
  public validateAvailability = (data: AvailabilityScenarioData, context: Context): ScenarioResult => {
    const errors: ValidatorError[] = [];

    const products = data.products;

    const soldOutProduct =
      products.find(({ result }) => {
        const availabilities = result.data ?? [];
        const availabilitiessSoldOut = availabilities.filter(
          (availability) => availability.status === AvailabilityStatus.SOLD_OUT,
        );
        return R.compose(R.not, R.isEmpty)(availabilitiessSoldOut);
      }) ?? null;

    if (soldOutProduct !== null) {
      const soldOutData = this.getSoldOutData(soldOutProduct);
      if (soldOutData.error !== null) {
        errors.push(soldOutData.error);
      } else if (soldOutData.data !== null) {
        context.productConfig.soldOutProduct = soldOutData.data;
      }
    }

    const availableData = this.findAvailableProducts(products, context);
    if (availableData.error !== null) {
      errors.push(availableData.error);
    } else if (availableData.data !== null) {
      context.productConfig.availableProducts = availableData.data;
    }

    return this.handleResult({
      name: data.name,
      result: {
        response: data.products[0].result.response,
        request: data.products[0].result.request,
        data: data,
      },
      errors,
      description: descriptions.availabilityCheckStatus,
    });
  };

  public getSoldOutData = (soldOutProduct: ProductResults): ErrorResult<ProductBookable> => {
    const availabilities = soldOutProduct.result.data ?? [];
    const availability = availabilities.find((a) => a.status === AvailabilityStatus.SOLD_OUT);

    return {
      data: new ProductBookable({
        product: soldOutProduct.product,
        availabilityIdSoldOut: availability?.id!,
        availabilityIdAvailable: null,
      }),
      error: null,
    };
  };

  public findAvailableProducts = (data: ProductResults[], context: Context): ErrorResult<ProductBookable[]> => {
    const result =
      data.filter(({ result }) => {
        const availabilities = result.data ?? [];
        const availabilitiesAvailable = availabilities.filter(
          (availability) =>
            (availability.status === AvailabilityStatus.AVAILABLE ||
              AvailabilityStatus.FREESALE ||
              AvailabilityStatus.LIMITED) &&
            availability.available,
        );
        return R.compose(R.not, R.isEmpty)(availabilitiesAvailable) && availabilitiesAvailable.length > 1;
      }) ?? null;

    if (result.length < 1) {
      context.terminateValidation = true;
      return {
        error: new ValidatorError({
          type: ErrorType.CRITICAL,
          message: 'There was not found availability that is available',
        }),
        data: null,
      };
    }

    const produts = result.map(({ product, result }) => {
      const availabilities = result.data ?? [];
      const availabilityIDs = availabilities
        .filter(
          (a) =>
            (a.status === AvailabilityStatus.AVAILABLE || AvailabilityStatus.FREESALE || AvailabilityStatus.LIMITED) &&
            a.available,
        )
        .map((a) => a.id);
      return new ProductBookable({
        product,
        availabilityIdSoldOut: null,
        availabilityIdAvailable: availabilityIDs,
      });
    });

    return {
      error: null,
      data: produts,
    };
  };
}
