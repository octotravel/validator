import { Flow, FlowResult } from "../Flow.ts";
import { GetCapabilitiesScenario } from "../../Scenarios/Capabilities/GetCapabilities.ts";
import { BaseFlow } from "../BaseFlow.ts";

export class CapabilitiesFlow extends BaseFlow implements Flow {
  constructor() {
    super("Get Capabilities", "");
  }

  public validate = async (): Promise<FlowResult> => {
    const scenario = new GetCapabilitiesScenario();
    return this.validateScenarios([scenario]);
  };
}
