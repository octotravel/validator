import { Scenario } from '../../../../common/validation/v2/scenario/Scenario';
import { GetScenarioResponse } from './GetScenarioResponse';

export class GetScenarioResponseFactory {
  public static create(scenario: Scenario): GetScenarioResponse {
    const steps = [];
    for (const step of scenario.getSteps()) {
      steps.push({
        id: step.getId(),
        name: step.getName(),
        description: step.getDescription(),
        docsUrl: step.getDocsUrl(),
      });
    }

    return {
      id: scenario.getId(),
      name: scenario.getName(),
      description: scenario.getDescription(),
      requiredCapabilities: scenario.getRequiredCapabilities(),
      optionalCapabilities: scenario.getOptionalCapabilities(),
      steps: steps,
    };
  }
}
