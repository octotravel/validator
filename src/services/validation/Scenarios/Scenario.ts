import { Availability, Product } from "@octocloud/types";

export interface Scenario {
  validate: () => Promise<ScenarioResult>;
}

export interface ScenarioRequest {
  url: string;
  method: string;
  body: Nullable<any>;
  headers: Record<string, string>;
}

export interface ScenarioResponse {
  body: Nullable<string>;
  status: Nullable<number>;
  error: Nullable<{
    body: any;
  }>;
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
  request: Nullable<ScenarioRequest>;
  response: Nullable<ScenarioResponse>;
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
