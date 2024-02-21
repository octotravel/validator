import { Context } from '../context/Context';
import { Scenario, ScenarioResult, ValidationResult } from '../Scenarios/Scenario';
import { FlowResult } from './Flow';

export abstract class BaseFlow {
  private readonly name: string;
  private readonly docs: string;
  public constructor(name: string, docs: string) {
    this.name = name;
    this.docs = docs;
  }

  private readonly getValidationResult = (scenarios: ScenarioResult[]): ValidationResult => {
    if (scenarios.some((scenario) => scenario.validationResult === ValidationResult.FAILED)) {
      return ValidationResult.FAILED;
    }
    if (scenarios.some((scenario) => scenario.validationResult === ValidationResult.WARNING)) {
      return ValidationResult.WARNING;
    }
    return ValidationResult.SUCCESS;
  };

  private readonly getFlowResult = (scenarios: ScenarioResult[]): FlowResult => {
    return {
      name: this.name,
      success: scenarios.every((scenario) => scenario.success),
      validationResult: this.getValidationResult(scenarios),
      totalScenarios: scenarios.length,
      succesScenarios: scenarios.filter((scenario) => scenario.success).length,
      scenarios,
      docs: this.docs,
    };
  };

  protected validateScenarios = async (scenarios: Scenario[], context: Context): Promise<FlowResult> => {
    const results = [];
    for await (const scenario of scenarios) {
      const result = await scenario.validate(context);
      results.push(result);
      if (context.terminateValidation) {
        break;
      }
    }

    return this.getFlowResult(results);
  };
}
