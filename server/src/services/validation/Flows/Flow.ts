import { ScenarioResult, ValidationResult } from "../Scenarios/Scenario";
import { Context } from "../context/Context";

export interface Flow {
  validate: (context: Context) => Promise<FlowResult>;
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
