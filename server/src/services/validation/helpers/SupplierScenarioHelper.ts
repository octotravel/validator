import { ScenarioHelper, ScenarioHelperData } from "./ScenarioHelper.ts";
import { SupplierValidator } from "../../../validators/backendValidator/Supplier/SupplierValidator.ts";
import { Supplier } from "https://esm.sh/@octocloud/types@1.5.2";
import { ScenarioResult } from "../Scenarios/Scenario.ts";
import { Context } from "../context/Context.ts";

export class SupplierScenarioHelper extends ScenarioHelper {
  public validateSupplier = (
    data: ScenarioHelperData<Supplier>,
    context: Context
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
      capabilities: context.getCapabilityIDs(),
    }).validate(result.data);
    return this.handleResult({
      ...data,
      errors,
    });
  };
}
