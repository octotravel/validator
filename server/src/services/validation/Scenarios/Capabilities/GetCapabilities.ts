import { Scenario } from "../Scenario.ts";
import { CapabilitiesScenarioHelper } from "../../helpers/CapabilitiesScenarioHelper.ts";
import descriptions from "../../consts/descriptions.ts";
import { Context } from "../../context/Context.ts";
import { SubRequestData } from "../../../logging/RequestData.ts";
import { SubRequestMapper } from "../../../logging/SubRequestMapper.ts";

export class GetCapabilitiesScenario implements Scenario {
  private capabilitiesScenarioHelper = new CapabilitiesScenarioHelper();

  public validate = async (context: Context) => {
    const apiClient = context.getApiClient();
    const date = new Date();
    const result = await apiClient.getCapabilities();
    const name = "Get Capabilities";
    const description = descriptions.getCapabilities;

    context.subrequestMapper.map(result, context, date);

    return this.capabilitiesScenarioHelper.validateCapabilities({
      result,
      name,
      description,
    });
  };
}
