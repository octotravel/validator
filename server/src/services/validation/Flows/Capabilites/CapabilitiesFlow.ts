import { Flow, FlowResult } from "../Flow";
import { GetCapabilitiesScenario } from "../../Scenarios/Capabilities/GetCapabilities";
import { BaseFlow } from "../BaseFlow";
import { Context } from "../../context/Context";

export class CapabilitiesFlow extends BaseFlow implements Flow {
  constructor() {
    super("Get Capabilities", "");
  }

  public validate = async (context: Context): Promise<FlowResult> => {
    const scenario = new GetCapabilitiesScenario();
    return this.validateScenarios([scenario], context);
  };
}
