import { Product } from '@octocloud/types';
import { STATUS_SUCCESS } from '../../../models/Error';
import { ProductValidator } from '../../../validators/backendValidator/Product/ProductValidator';
import { ResponseStatusValidator } from '../../../validators/backendValidator/Response/ResponseStatusValidator';
import { ValidatorError } from '../../../validators/backendValidator/ValidatorHelpers';
import { Context } from '../context/Context';
import { ScenarioResult } from '../Scenarios/Scenario';
import { ScenarioHelper, ScenarioHelperData } from './ScenarioHelper';

export class ProductScenarioHelper extends ScenarioHelper {
  public validateProducts = (data: ScenarioHelperData<Product[]>, context: Context): ScenarioResult => {
    const { result } = data;
    const statusErrors = new ResponseStatusValidator({ expectedStatus: STATUS_SUCCESS }).validate(result);
    if (!result?.response || result.response.error) {
      context.terminateValidation = true;
      return this.handleResult({
        ...data,
        errors: statusErrors,
      });
    }
    const products = Array.isArray(result?.data) ? result?.data : [];
    const errors: ValidatorError[] = [...statusErrors];
    const configErrors = context.setProducts(products);
    errors.push(...configErrors);

    const validatorErrors = products.flatMap((product, i: number) =>
      new ProductValidator({
        capabilities: context.getCapabilityIDs(),
        path: `[${i}]`,
      }).validate(product),
    );
    errors.push(...validatorErrors);

    return this.handleResult({
      ...data,
      errors,
    });
  };

  public validateProduct = (data: ScenarioHelperData<Product>, context: Context): ScenarioResult => {
    const { result } = data;
    const statusErrors = new ResponseStatusValidator({ expectedStatus: STATUS_SUCCESS }).validate(result);
    if (!result?.response || result.response.error) {
      return this.handleResult({
        ...data,
        errors: statusErrors,
      });
    }

    const errors = [
      ...statusErrors,
      ...new ProductValidator({
        capabilities: context.getCapabilityIDs(),
      }).validate(result.data),
    ];
    return this.handleResult({
      ...data,
      errors,
    });
  };
}
