import { Scenario } from '../../../../common/validation/v2/scenario/Scenario';
import { GetScenariosScenarioResponse } from './GetScenariosResponse';

export class GetScenariosResponseFactory {
  public static create(scenario: Scenario): GetScenariosScenarioResponse {
    return {
      id: scenario.getId(),
      name: scenario.getName(),
      description: scenario.getDescription(),
      requiredCapabilities: scenario.getRequiredCapabilities(),
      optionalCapabilities: scenario.getOptionalCapabilities(),
    };
  }
}
