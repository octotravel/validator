import { Supplier } from '@octocloud/types';
import { STATUS_SUCCESS } from '../../../models/Error';
import { ResponseStatusValidator } from '../../../validators/backendValidator/Response/ResponseStatusValidator';
import { SupplierValidator } from '../../../validators/backendValidator/Supplier/SupplierValidator';
import { Context } from '../context/Context';
import { ScenarioResult } from '../Scenarios/Scenario';
import { ScenarioHelper, ScenarioHelperData } from './ScenarioHelper';

export class SupplierScenarioHelper extends ScenarioHelper {
  public validateSupplier = (data: ScenarioHelperData<Supplier>, context: Context): ScenarioResult => {
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
      ...new SupplierValidator({
        capabilities: context.getCapabilityIDs(),
      }).validate(result.data),
    ];
    return this.handleResult({
      ...data,
      errors,
    });
  };
}
