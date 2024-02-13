import { Scenario } from "../Scenario";
import { CapabilitiesScenarioHelper } from "../../helpers/CapabilitiesScenarioHelper";
import descriptions from "../../consts/descriptions";
import { Context } from "../../context/Context";

export class GetCapabilitiesScenario implements Scenario {
  private capabilitiesScenarioHelper = new CapabilitiesScenarioHelper();

  public validate = async (context: Context) => {
    const apiClient = context.getApiClient();
    
    const result = await apiClient.getCapabilities(context);
    const name = "Get Capabilities";
    const description = descriptions.getCapabilities;

    if (result.data) {
      context.setCapabilities(result.data);
    }

    return this.capabilitiesScenarioHelper.validateCapabilities({
      result,
      name,
      description,
    });
  };
}
