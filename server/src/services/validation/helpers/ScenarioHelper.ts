import { CapabilityId } from "https://esm.sh/@octocloud/types@1.3.1";
import * as R from "https://esm.sh/ramda@0.28.0";
import { STATUS_NOT_FOUND } from "../../../models/Error.ts";
import {
  ErrorType,
  ModelValidator,
  ValidatorError,
} from "../../../validators/backendValidator/ValidatorHelpers.ts";
import { Result, ResultResponse } from "../api/types.ts";
import { Config } from "../config/Config.ts";
import { ScenarioResult, ValidationResult } from "../Scenarios/Scenario.ts";

interface ScenarioData<T> {
  name: string;
  success?: boolean;
  result: Result<T>;
  errors: ValidatorError[];
  description: string;
}

export interface ScenarioHelperData<T> {
  name: string;
  result: Result<T>;
  description: string;
}

export interface ScenarioConfigData {
  capabilities?: CapabilityId[];
  supplierReference?: string;
  resellerReference?: string;
}

export class ScenarioHelper {
  protected config = Config.getInstance();
  private getValidationResult = <T>(
    data: ScenarioData<T>
  ): ValidationResult => {
    if (!R.isEmpty(data.errors)) {
      if (data.errors.some((error) => error.type === ErrorType.CRITICAL)) {
        return ValidationResult.FAILED;
      }
      if (data.errors.some((error) => error.type === ErrorType.WARNING)) {
        return ValidationResult.WARNING;
      }
    }
    return ValidationResult.SUCCESS;
  };

  public handleResult = <T>(data: ScenarioData<T>): ScenarioResult => {
    const { result } = data;
    if (result?.response?.error) {
      if (result.response.error.status === STATUS_NOT_FOUND) {
        data.errors = [
          ...data.errors,
          new ValidatorError({
            type: ErrorType.CRITICAL,
            message: "Endpoint not implemented",
          }),
        ];
      }
    }
    let parsedResponseBody = null;
    if (result.response?.body) {
      try {
        parsedResponseBody = JSON.parse(result.response.body)
      } catch (e) {
        data.errors = [
          ...data.errors,
          new ValidatorError({
            type: ErrorType.CRITICAL,
            message: `Endpoint response cannot be parsed: ${e}`
          })
        ]
      }
    };

    let parsedResponseErrorBody = null;
    if (result.response?.error?.body) {
      try {
        parsedResponseErrorBody = JSON.parse(result.response.error.body)
      } catch (e) {
        data.errors = [
          ...data.errors,
          new ValidatorError({
            type: ErrorType.CRITICAL,
            message: `Endpoint response cannot be parsed: ${e}`
          })
        ]
      }
    };
    const response: ResultResponse | null =
      result?.response === null
        ? null
        : {
            headers: result.response.headers,
            body: parsedResponseBody,
            status: result.response.status,
            error: result.response.error
              ? {
                  body: parsedResponseErrorBody,
                  status: result.response.status,
                }
              : null,
          };
    return {
      name: data.name,
      success: data.success ?? this.isSuccess(data.errors),
      validationResult: this.getValidationResult(data),
      request: result.request,
      response: response,
      errors: data.errors.map((error) => error?.mapError()),
      description: data.description,
    };
  };

  public validateError = <T>(
    data: ScenarioHelperData<T>,
    validator: ModelValidator
  ) => {
    const { result } = data;

    const errors = validator.validate(result);
    return this.handleResult({
      ...data,
      success: this.isSuccess(errors),
      errors: errors,
    });
  };

  protected isSuccess = (errors: ValidatorError[]): boolean => {
    return !errors.some((e) => e.type === ErrorType.CRITICAL);
  };
}
