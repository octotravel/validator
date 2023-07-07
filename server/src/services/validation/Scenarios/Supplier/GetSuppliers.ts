import { Scenario } from "../Scenario";
import { SupplierScenarioHelper } from "../../helpers/SupplierScenarioHelper";
import descriptions from "../../consts/descriptions";
import { Context } from "../../context/Context";

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
