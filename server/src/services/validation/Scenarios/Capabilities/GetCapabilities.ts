import { Scenario } from "../Scenario.ts";
import { CapabilitiesScenarioHelper } from "../../helpers/CapabilitiesScenarioHelper.ts";
import { Config } from "../../config/Config.ts";
import descriptions from "../../consts/descriptions.ts";
import { CapabilityId, Capability } from "https://esm.sh/@octocloud/types@1.3.1";

export class GetCapabilitiesScenario implements Scenario {
  private config = Config.getInstance();
  private apiClient = this.config.getApiClient();
  private capabilitiesScenarioHelper = new CapabilitiesScenarioHelper();

  public validate = async () => {
    const result = await this.apiClient.getCapabilities();
    const name = "Get Capabilities";
    const description = descriptions.getCapabilities;

    if(result.data) {
      const supportedCapabilities = [CapabilityId.Pricing, CapabilityId.Content, CapabilityId.Pickups];
      const capabilities = result.data.map(capability => {
        if (supportedCapabilities.includes(capability.id)) {
          return capability;
        }
      }).filter(Boolean) as Capability[];
      this.config.setCapabilities(capabilities);
    }

    console.log(this.config.getCapabilityIDs())

    return this.capabilitiesScenarioHelper.validateCapabilities({
      result,
      name,
      description,
    });
  };
}
