import { ProductValidator } from './../../../validators/backendValidator/Product/ProductValidator';
import { Product } from '@octocloud/types';
import { ScenarioHelper, ScenarioHelperData } from './ScenarioHelper';
import { ValidatorError } from '../../../validators/backendValidator/ValidatorHelpers';
import { Context } from '../context/Context';
import { ScenarioResult } from '../Scenarios/Scenario';

export class ProductScenarioHelper extends ScenarioHelper {
  public validateProducts = (data: ScenarioHelperData<Product[]>, context: Context): ScenarioResult => {
    const { result } = data;
    if (result?.response?.error) {
      context.terminateValidation = true;
      return this.handleResult({
        ...data,
        success: false,
        errors: [],
      });
    }
    const products = Array.isArray(result?.data) ? result?.data : [];
    const errors = new Array<ValidatorError>();
    const configErrors = context.setProducts(products);
    errors.push(...configErrors);

    const validatorErrors = products
      .map((product: any, i: number) =>
        new ProductValidator({
          capabilities: context.getCapabilityIDs(),
          path: `[${i}]`,
        }).validate(product),
      )
      .flat(1);
    errors.push(...validatorErrors);

    return this.handleResult({
      ...data,
      errors,
    });
  };

  public validateProduct = (data: ScenarioHelperData<Product>, context: Context): ScenarioResult => {
    const { result } = data;
    if (result?.response?.error) {
      return this.handleResult({
        ...data,
        success: false,
        errors: [],
      });
    }

    const errors = new ProductValidator({
      capabilities: context.getCapabilityIDs(),
    }).validate(result.data);
    return this.handleResult({
      ...data,
      errors,
    });
  };
}
