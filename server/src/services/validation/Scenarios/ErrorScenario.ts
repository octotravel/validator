import { ValidatorError } from "../../../validators/backendValidator/ValidatorHelpers.ts";
import { Scenario, ScenarioResult, ValidationResult } from "./Scenario.ts";

export class ErrorScenario implements Scenario {
  private errors: ValidatorError[] = [];
  constructor(errors: ValidatorError[]) {
    this.errors = errors;
  }
  public validate = async (): Promise<ScenarioResult> => {
    return {
      name: "",
      success: false,
      validationResult: ValidationResult.FAILED,
      request: null,
      response: null,
      errors: this.errors,
      description: "",
    };
  };
}
