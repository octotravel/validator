import { Availability, Product } from '@octocloud/types';
import { MappedError } from '../../../validators/backendValidator/ValidatorHelpers';
import { Context } from '../context/Context';

export interface Scenario {
  validate: (context: Context) => Promise<ScenarioResult>;
}

export interface ScenarioRequest {
  url: string;
  method: string;
  body: unknown | null;
  headers: Record<string, string>;
}

export interface ScenarioResponse {
  body: string | null;
  status: number | null;
  error: {
    body: unknown;
  } | null;
  headers: Record<string, string>;
}

export enum ValidationResult {
  SUCCESS = 'SUCCESS',
  WARNING = 'WARNING',
  FAILED = 'FAILED',
}

export interface ScenarioResult {
  name: string;
  success: boolean;
  validationResult: ValidationResult;
  request: ScenarioRequest | null;
  response: ScenarioResponse | null;
  errors: MappedError[];
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
