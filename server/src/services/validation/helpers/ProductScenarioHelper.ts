import { ProductValidator } from "./../../../validators/backendValidator/Product/ProductValidator.ts";
import { Product } from "https://esm.sh/@octocloud/types@1.3.1";
import { ScenarioHelper, ScenarioHelperData } from "./ScenarioHelper.ts";
import { ValidatorError } from "../../../validators/backendValidator/ValidatorHelpers.ts";

export class ProductScenarioHelper extends ScenarioHelper {
  public validateProducts = (data: ScenarioHelperData<Product[]>) => {
    const { result } = data;
    if (result?.response?.error) {
      return this.handleResult({
        ...data,
        success: false,
        errors: [],
      });
    }
    const products = result.data ?? [];
    const errors = new Array<ValidatorError>();
    const configErrors = this.config.setProducts(products);
    errors.push(...configErrors);

    const validatorErrors = products
      .map((product: any, i: number) =>
        new ProductValidator({
          capabilities: this.config.getCapabilityIDs(),
          path: `[${i}]`,
        }).validate(product)
      )
      .flat(1);
    errors.push(...validatorErrors);

    return this.handleResult({
      ...data,
      errors,
    });
  };

  public validateProduct = (data: ScenarioHelperData<Product>) => {
    const { result } = data;
    if (result?.response?.error) {
      return this.handleResult({
        ...data,
        success: false,
        errors: [],
      });
    }

    const errors = new ProductValidator({
      capabilities: this.config.getCapabilityIDs(),
    }).validate(result.data);
    return this.handleResult({
      ...data,
      errors,
    });
  };
}
