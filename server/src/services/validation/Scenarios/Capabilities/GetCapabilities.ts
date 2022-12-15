import { Scenario } from "../Scenario.ts";
import { CapabilitiesScenarioHelper } from "../../helpers/CapabilitiesScenarioHelper.ts";
import { Config } from "../../config/Config.ts";
import descriptions from "../../consts/descriptions.ts";

export class GetCapabilitiesScenario implements Scenario {
  private config = Config.getInstance();
  private apiClient = this.config.getApiClient();
  private capabilitiesScenarioHelper = new CapabilitiesScenarioHelper();

  public validate = async () => {
    const result = await this.apiClient.getCapabilities();
    const name = "Get Capabilities.ts";
    const description = descriptions.getCapabilities;

    return this.capabilitiesScenarioHelper.validateCapabilities({
      result,
      name,
      description,
    });
  };
}
