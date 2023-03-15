import { Scenario } from "../Scenario.ts";
import { SupplierScenarioHelper } from "../../helpers/SupplierScenarioHelper.ts";
import descriptions from "../../consts/descriptions.ts";
import { Context } from "../../context/Context.ts";

export class GetSupplierScenario implements Scenario {
  private supplierScenarioHelper = new SupplierScenarioHelper();

  public validate = async (context: Context) => {
    const apiClient = context.getApiClient();
    
    const result = await apiClient.getSupplier(context);
    const name = "Get Supplier";
    const description = descriptions.getSupplier;

    return this.supplierScenarioHelper.validateSupplier({
      result,
      name,
      description,
    }, context);
  };
}
