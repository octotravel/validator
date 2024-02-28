import { Scenario } from '../../../../common/validation/v2/scenario/Scenario';
import { ScenarioResponse } from './ScenariosResponse';

export class ScenarioResponseFactory {
  public static create(scenario: Scenario): ScenarioResponse {
    return {
      id: scenario.getId(),
      name: scenario.getName(),
      description: scenario.getDescription(),
      requiredCapabilities: scenario.getRequiredCapabilities(),
      optionalCapabilities: scenario.getOptionalCapabilities(),
    };
  }
}
