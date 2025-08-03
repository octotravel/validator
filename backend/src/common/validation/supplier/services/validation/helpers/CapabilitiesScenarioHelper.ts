import { Capability } from '@octocloud/types';
import { CapabilityValidator } from '../../../validators/backendValidator/Capability/CapabilityValidator';
import { ScenarioResult } from '../Scenarios/Scenario';
import { ScenarioHelper, ScenarioHelperData } from './ScenarioHelper';

export class CapabilitiesScenarioHelper extends ScenarioHelper {
  public validateCapabilities = (data: ScenarioHelperData<Capability[]>): ScenarioResult => {
    const validator = new CapabilityValidator({});
    const { result } = data;
    if (result?.response?.error) {
      return this.handleResult({
        ...data,
        success: false,
        errors: [],
      });
    }
    const capabilities = Array.isArray(result?.data) ? result?.data : [];
    const errors = capabilities.flatMap(validator.validate);
    return this.handleResult({
      ...data,
      errors,
    });
  };
}
