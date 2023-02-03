import { Scenario } from "../Scenario.ts";
import { CapabilitiesScenarioHelper } from "../../helpers/CapabilitiesScenarioHelper.ts";
import descriptions from "../../consts/descriptions.ts";
import { CapabilityId, Capability } from "https://esm.sh/@octocloud/types@1.3.1";
import { Context } from "../../context/Context.ts";

export class GetCapabilitiesScenario implements Scenario {
  private capabilitiesScenarioHelper = new CapabilitiesScenarioHelper();

  public validate = async (context: Context) => {
    const apiClient = context.getApiClient();
    const result = await apiClient.getCapabilities();
    const name = "Get Capabilities";
    const description = descriptions.getCapabilities;

    if(result.data) {
      const supportedCapabilities = [CapabilityId.Pricing];
      const capabilities = result.data.map(capability => {
        if (supportedCapabilities.includes(capability.id)) {
          return capability;
        }
      }).filter(Boolean) as Capability[];
      context.setCapabilities(capabilities);  
    }

    return this.capabilitiesScenarioHelper.validateCapabilities({
      result,
      name,
      description,
    });
  };
}
