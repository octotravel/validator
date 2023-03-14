import { Scenario } from "../Scenario.ts";
import { SupplierScenarioHelper } from "../../helpers/SupplierScenarioHelper.ts";
import descriptions from "../../consts/descriptions.ts";
import { Context } from "../../context/Context.ts";
import { SubRequestMapper } from "../../../logging/SubRequestMapper.ts";

export class GetSupplierScenario implements Scenario {
  private supplierScenarioHelper = new SupplierScenarioHelper();

  public validate = async (context: Context) => {
    const apiClient = context.getApiClient();
    const date = new Date();
    const result = await apiClient.getSupplier();
    const name = "Get Supplier";
    const description = descriptions.getSupplier;

    context.subrequestMapper.map(result, context, date);

    return this.supplierScenarioHelper.validateSupplier({
      result,
      name,
      description,
    }, context);
  };
}
