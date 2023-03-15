import { ScenarioHelper, ScenarioHelperData } from "./ScenarioHelper.ts";
import { Capability } from "https://esm.sh/@octocloud/types@1.5.2";
import { CapabilityValidator } from "../../../validators/backendValidator/Capability/CapabilityValidator.ts";

export class CapabilitiesScenarioHelper extends ScenarioHelper {
  public validateCapabilities = (
    data: ScenarioHelperData<Capability[]>
  ) => {
    const validator = new CapabilityValidator({});
    const { result } = data;
    if (result?.response?.error) {
      return this.handleResult({
        ...data,
        success: false,
        errors: [],
      });
    }
    const capabilities = result?.data ?? []
    const errors = capabilities.map(validator.validate).flat(1);
    return this.handleResult({
      ...data,
      errors,
    });
  };
}
