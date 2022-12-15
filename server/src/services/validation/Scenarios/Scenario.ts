import { Availability, Product } from "npm:@octocloud/types@^1.3.1";

export interface Scenario {
  validate: () => Promise<ScenarioResult>;
}

export interface ScenarioRequest {
  url: string;
  method: string;
  body: any | null;
  headers: Record<string, string>;
}

export interface ScenarioResponse {
  body: string | null;
  status: number | null;
  error: {
    body: any;
  } | null;
  headers: Record<string, string>;
}

export enum ValidationResult {
  SUCCESS = "SUCCESS",
  WARNING = "WARNING",
  FAILED = "FAILED",
}

export interface ScenarioResult {
  name: string;
  success: boolean;
  validationResult: ValidationResult;
  request: ScenarioRequest | null;
  response: ScenarioResponse | null;
  errors: any[]; // validation errors
  description: string;
}

export interface BookingValidateData {
  productId: string;
  optionId: string;
  availability: Availability[];
  product: Product;
  availabilityTo?: Availability[];
  availabilityFrom?: Availability[];
}
