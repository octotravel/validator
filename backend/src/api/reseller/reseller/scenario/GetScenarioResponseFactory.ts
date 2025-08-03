import { Scenario } from '../../../../common/validation/reseller/scenario/Scenario';
import { GetScenarioResponse, GetScenarioStepResponse } from './GetScenarioResponse';

export class GetScenarioResponseFactory {
  public static create(scenario: Scenario): GetScenarioResponse {
    const steps: GetScenarioStepResponse[] = [];
    for (const step of scenario.getSteps()) {
      steps.push({
        id: step.getId(),
        name: step.getName(),
        description: step.getDescription(),
        questions: step.getQuestions().map((question) => {
          const { answer, ...questionWithoutAnswer } = question;
          return questionWithoutAnswer;
        }),
        endpointMethod: step.getEndpointMethod(),
        endpointUrl: step.getEndpointUrl(),
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
