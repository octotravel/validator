import { Scenario } from "../Scenario.ts";
import { CapabilitiesScenarioHelper } from "../../helpers/CapabilitiesScenarioHelper.ts";
import descriptions from "../../consts/descriptions.ts";
import { CapabilityId, Capability } from "@octocloud/types";
import { Context } from "../../context/Context.ts";

export class GetCapabilitiesScenario implements Scenario {
  private capabilitiesScenarioHelper = new CapabilitiesScenarioHelper();

  public validate = async (context: Context) => {
    const apiClient = context.getApiClient();
    const result = await apiClient.getCapabilities();
    const name = "Get Capabilities";
    const description = descriptions.getCapabilities;

    if(result.data) {
      context.setCapabilities(result.data);  
    }

    return this.capabilitiesScenarioHelper.validateCapabilities({
      result,
      name,
      description,
    });
  };
}
