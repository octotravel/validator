import { Capability } from '@octocloud/types';
import { STATUS_SUCCESS } from '../../../models/Error';
import { CapabilityValidator } from '../../../validators/backendValidator/Capability/CapabilityValidator';
import { ResponseStatusValidator } from '../../../validators/backendValidator/Response/ResponseStatusValidator';
import { ScenarioResult } from '../Scenarios/Scenario';
import { ScenarioHelper, ScenarioHelperData } from './ScenarioHelper';

export class CapabilitiesScenarioHelper extends ScenarioHelper {
  public validateCapabilities = (data: ScenarioHelperData<Capability[]>): ScenarioResult => {
    const validator = new CapabilityValidator({});
    const { result } = data;
    const statusErrors = new ResponseStatusValidator({ expectedStatus: STATUS_SUCCESS }).validate(result);
    if (!result?.response || result.response.error) {
      return this.handleResult({
        ...data,
        errors: statusErrors,
      });
    }
    const capabilities = Array.isArray(result?.data) ? result?.data : [];
    const errors = [...statusErrors, ...capabilities.flatMap(validator.validate)];
    return this.handleResult({
      ...data,
      errors,
    });
  };
}
