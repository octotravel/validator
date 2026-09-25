import { Context } from '../context/Context';
import { ScenarioResult, ValidationResult } from '../Scenarios/Scenario';

export interface Flow {
  validate: (context: Context) => Promise<FlowResult>;
  getName: () => string;
  getReservationDemand: (context: Context) => ReservationDemand;
}

/**
 * How many valid reservations a flow creates against the available product during a run.
 * Declared per flow so the controller can sum demand and check availability up front
 * (see docs/reservation-availability-refactor.md). Only count reservations that hold real
 * inventory on `availableProducts[0]` — invalid/sold-out variants don't consume capacity.
 */
export interface ReservationDemand {
  reservations: number;
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
