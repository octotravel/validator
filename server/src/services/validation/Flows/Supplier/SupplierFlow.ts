import docs from "../../consts/docs";
import { Context } from "../../context/Context";
import { Scenario } from "../../Scenarios/Scenario";
import { GetSupplierScenario } from "../../Scenarios/Supplier/GetSuppliers";
import { BaseFlow } from "../BaseFlow";
import { Flow, FlowResult } from "../Flow";

export class SupplierFlow extends BaseFlow implements Flow {
  constructor() {
    super("Get Suppliers", docs.supplier);
  }

  public validate = async (context: Context): Promise<FlowResult> => {
    const scenarios: Scenario[] = [new GetSupplierScenario()];
    return this.validateScenarios(scenarios, context);
  };
}
