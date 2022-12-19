import * as R from "npm:ramda@^0.28.0";
import { Availability, AvailabilityStatus, Product } from "https://esm.sh/@octocloud/types@1.3.1";
import { ScenarioHelper } from "./ScenarioHelper.ts";
import { Result } from "../api/types.ts";
import { ErrorResult } from "../config/Config.ts";
import {
  ErrorType,
  ValidatorError,
} from "../../../validators/backendValidator/ValidatorHelpers.ts";
import { ProductBookable } from "../config/ProductBookable.ts";
import descriptions from "../consts/descriptions.ts";

export interface AvailabilityScenarioData {
  name: string;
  products: ProductResults[];
}

interface ProductResults {
  result: Result<Availability[]>;
  product: Product;
}

export class AvailabilityStatusScenarioHelper extends ScenarioHelper {
  public validateAvailability = (data: AvailabilityScenarioData) => {
    const errors: ValidatorError[] = [];

    const products = data.products;
    const soldOutData = this.findSoldOutProduct(products);
    if (soldOutData.error !== null) {
      errors.push(soldOutData.error);
    } else if (soldOutData.data !== null) {
      this.config.productConfig.soldOutProduct = soldOutData.data;
    }
    const availableData = this.findAvailableProducts(products);
    if (availableData.error !== null) {
      errors.push(availableData.error);
    } else if (availableData.data !== null) {
      this.config.productConfig.availableProducts = availableData.data;
    }
    return this.handleResult({
      name: data.name,
      result: {
        response: null,
        request: null,
        data: null,
      },
      errors,
      description: descriptions.availabilityCheckStatus,
    });
  };

  public findSoldOutProduct = (
    data: ProductResults[]
  ): ErrorResult<ProductBookable> => {
    const result =
      data.find(({ result }) => {
        const availabilities = result.data ?? [];
        const availabilitiessSoldOut = availabilities.filter(
          (availability) => availability.status === AvailabilityStatus.SOLD_OUT
        );
        return R.compose(R.not, R.isEmpty)(availabilitiessSoldOut);
      }) ?? null;

    if (result === null) {
      this.config.terminateValidation = true;
      return {
        error: new ValidatorError({
          type: ErrorType.CRITICAL,
          message: "There was not found availability with status=SOLD_OUT",
        }),
        data: null,
      };
    }
    const availabilities = result.result.data ?? [];
    const availability = availabilities.find(
      (a) => a.status === AvailabilityStatus.SOLD_OUT
    );
    return {
      data: new ProductBookable({
        product: result.product,
        availabilityIdSoldOut: availability?.id as string,
        availabilityIdAvailable: null,
      }),
      error: null,
    };
  };

  public findAvailableProducts = (
    data: ProductResults[]
  ): ErrorResult<ProductBookable[]> => {
    const result =
      data.filter(({ result }) => {
        const availabilities = result.data ?? [];
        const availabilitiesAvailable = availabilities.filter(
          (availability) =>
            (availability.status === AvailabilityStatus.AVAILABLE ||
              AvailabilityStatus.FREESALE ||
              AvailabilityStatus.LIMITED) &&
            availability.available
        );
        return (
          R.compose(R.not, R.isEmpty)(availabilitiesAvailable) &&
          availabilitiesAvailable.length > 1
        );
      }) ?? null;

    if (result.length < 1) {
      this.config.terminateValidation = true;
      return {
        error: new ValidatorError({
          type: ErrorType.CRITICAL,
          message: "There was not found availability that is available",
        }),
        data: null,
      };
    }

    const produts = result.map(({ product, result }) => {
      const availabilities = result.data ?? [];
      const availabilityIDs = availabilities
        .filter(
          (a) =>
            (a.status === AvailabilityStatus.AVAILABLE ||
              AvailabilityStatus.FREESALE ||
              AvailabilityStatus.LIMITED) &&
            a.available
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
