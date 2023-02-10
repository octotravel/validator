import { Flow, FlowResult } from "../Flow.ts";
import { GetCapabilitiesScenario } from "../../Scenarios/Capabilities/GetCapabilities.ts";
import { BaseFlow } from "../BaseFlow.ts";
import { Context } from "../../context/Context.ts";

export class CapabilitiesFlow extends BaseFlow implements Flow {
  constructor() {
    super("Get Capabilities", "");
  }

  public validate = async (context: Context): Promise<FlowResult> => {
    const scenario = new GetCapabilitiesScenario();
    return this.validateScenarios([scenario], context);
  };
}
