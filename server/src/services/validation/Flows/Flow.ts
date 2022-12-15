import { ScenarioResult, ValidationResult } from "../Scenarios/Scenario.ts";

export interface Flow {
  validate: () => Promise<FlowResult>;
}

export interface FlowResult {
  name: string;
  success: boolean;
  validationResult: ValidationResult;
  totalScenarios: number;
  succesScenarios: number;
  scenarios: ScenarioResult[];
  docs: string;
}
