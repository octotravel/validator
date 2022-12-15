import { Scenario } from "../Scenario.ts";
import { SupplierScenarioHelper } from "../../helpers/SupplierScenarioHelper.ts";
import { Config } from "../../config/Config.ts";
import descriptions from "../../consts/descriptions.ts";

export class GetSupplierScenario implements Scenario {
  private config = Config.getInstance();
  private apiClient = this.config.getApiClient();
  private supplierScenarioHelper = new SupplierScenarioHelper();

  public validate = async () => {
    const result = await this.apiClient.getSupplier();
    const name = "Get Supplier.ts";
    const description = descriptions.getSupplier;

    return this.supplierScenarioHelper.validateSupplier({
      result,
      name,
      description,
    });
  };
}
