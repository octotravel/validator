import { Scenario } from "./../../Scenarios/Scenario";
import { GetProductScenario } from "../../Scenarios/Product/GetProduct";
import { GetProductInvalidScenario } from "../../Scenarios/Product/GetProductInvalid";
import { GetProductsScenario } from "../../Scenarios/Product/GetProducts";
import { Flow, FlowResult } from "../Flow";
import { BaseFlow } from "../BaseFlow";
import docs from "../../consts/docs";
import { Context } from "../../context/Context";

export class ProductFlow extends BaseFlow implements Flow {
  constructor() {
    super("Get Products", docs.products);
  }

  public validate = async (context: Context): Promise<FlowResult> => {
    const scenarios: Scenario[] = [
      new GetProductsScenario(),
      new GetProductScenario(),
      new GetProductInvalidScenario(),
    ];
    return this.validateScenarios(scenarios, context);
  };
}
