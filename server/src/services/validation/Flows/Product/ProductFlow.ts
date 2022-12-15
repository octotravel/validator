import { Scenario } from "./../../Scenarios/Scenario.ts";
import { GetProductScenario } from "../../Scenarios/Product/GetProduct.ts";
import { GetProductInvalidScenario } from "../../Scenarios/Product/GetProductInvalid.ts";
import { GetProductsScenario } from "../../Scenarios/Product/GetProducts.ts";
import { Flow, FlowResult } from "../Flow.ts";
import { BaseFlow } from "../BaseFlow.ts";
import docs from "../../consts/docs.ts";

export class ProductFlow extends BaseFlow implements Flow {
  constructor() {
    super("Get Products", docs.products);
  }

  public validate = async (): Promise<FlowResult> => {
    const scenarios: Scenario[] = [
      new GetProductsScenario(),
      new GetProductScenario(),
      new GetProductInvalidScenario(),
    ];
    return this.validateScenarios(scenarios);
  };
}
