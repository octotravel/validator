import docs from "../../consts/docs.ts";
import { Context } from "../../context/Context.ts";
import { Scenario } from "../../Scenarios/Scenario.ts";
import { GetSupplierScenario } from "../../Scenarios/Supplier/GetSuppliers.ts";
import { BaseFlow } from "../BaseFlow.ts";
import { Flow, FlowResult } from "../Flow.ts";

export class SupplierFlow extends BaseFlow implements Flow {
  constructor() {
    super("Get Suppliers", docs.supplier);
  }

  public validate = async (context: Context): Promise<FlowResult> => {
    const scenarios: Scenario[] = [new GetSupplierScenario()];
    return this.validateScenarios(scenarios, context);
  };
}
