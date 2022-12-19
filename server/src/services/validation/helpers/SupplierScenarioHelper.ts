import { ScenarioHelper, ScenarioHelperData } from "./ScenarioHelper.ts";
import { SupplierValidator } from "../../../validators/backendValidator/Supplier/SupplierValidator.ts";
import { Supplier } from "https://esm.sh/@octocloud/types@1.3.1";
import { ScenarioResult } from "../Scenarios/Scenario.ts";

export class SupplierScenarioHelper extends ScenarioHelper {
  public validateSupplier = (
    data: ScenarioHelperData<Supplier>
  ): ScenarioResult => {
    const { result } = data;
    if (result?.response?.error) {
      return this.handleResult({
        ...data,
        success: false,
        errors: [],
      });
    }
    const errors = new SupplierValidator({
      capabilities: this.config.getCapabilityIDs(),
    }).validate(result.data);
    return this.handleResult({
      ...data,
      errors,
    });
  };
}
