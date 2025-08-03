import descriptions from '../../consts/descriptions';
import { Context } from '../../context/Context';
import { CapabilitiesScenarioHelper } from '../../helpers/CapabilitiesScenarioHelper';
import { Scenario, ScenarioResult } from '../Scenario';

export class GetCapabilitiesScenario implements Scenario {
  private readonly capabilitiesScenarioHelper = new CapabilitiesScenarioHelper();

  public validate = async (context: Context): Promise<ScenarioResult> => {
    const apiClient = context.getApiClient();

    const result = await apiClient.getCapabilities(context);
    const name = 'Get Capabilities';
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
