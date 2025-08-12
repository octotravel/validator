import { Context } from '../context/Context';
import { ScenarioResult, ValidationResult } from '../Scenarios/Scenario';

export interface Flow {
  validate: (context: Context) => Promise<FlowResult>;
  getName: () => string;
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
