import { Supplier } from '@octocloud/types';
import { SupplierValidator } from '../../../validators/backendValidator/Supplier/SupplierValidator';
import { Context } from '../context/Context';
import { ScenarioResult } from '../Scenarios/Scenario';
import { ScenarioHelper, ScenarioHelperData } from './ScenarioHelper';

export class SupplierScenarioHelper extends ScenarioHelper {
  public validateSupplier = (data: ScenarioHelperData<Supplier>, context: Context): ScenarioResult => {
    const { result } = data;
    if (result?.response?.error) {
      return this.handleResult({
        ...data,
        success: false,
        errors: [],
      });
    }
    const errors = new SupplierValidator({
      capabilities: context.getCapabilityIDs(),
    }).validate(result.data);
    return this.handleResult({
      ...data,
      errors,
    });
  };
}
