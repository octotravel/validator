import { CapabilityId } from '@octocloud/types';
import * as R from 'ramda';
import { STATUS_NOT_FOUND } from '../../../models/Error';
import { ErrorType, ModelValidator, ValidatorError } from '../../../validators/backendValidator/ValidatorHelpers';
import { Result, ResultResponse } from '../api/types';
import { ScenarioResult, ValidationResult } from '../Scenarios/Scenario';

interface ScenarioData<T> {
  name: string;
  success?: boolean;
  result: Result<T>;
  errors: ValidatorError[];
  description: string;
  errorExpected?: boolean;
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
  private readonly getValidationResult = <T>(data: ScenarioData<T>): ValidationResult => {
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
    const { result, errorExpected } = data;
    if (result?.response?.error) {
      const status = result.response.error.status;
      if (status === STATUS_NOT_FOUND) {
        data.errors = [
          ...data.errors,
          new ValidatorError({
            type: ErrorType.CRITICAL,
            message: 'Endpoint not implemented',
          }),
        ];
      }

      if (!errorExpected && (status < 200 || status >= 400)) {
        data.errors = [
          ...data.errors,
          new ValidatorError({
            type: ErrorType.CRITICAL,
            message: 'Endpoint cannot be validated',
          }),
        ];
      }
    }

    let parsedResponseBody = null;
    if (result.response?.body) {
      try {
        parsedResponseBody = JSON.parse(result.response.body);
      } catch (e) {
        data.errors = [
          ...data.errors,
          new ValidatorError({
            type: ErrorType.CRITICAL,
            message: `Endpoint response cannot be parsed: ${e}`,
          }),
        ];
      }
    }

    let parsedResponseErrorBody = null;
    if (result.response?.error?.body) {
      try {
        parsedResponseErrorBody = JSON.parse(result.response.error.body);
      } catch (e) {
        data.errors = [
          ...data.errors,
          new ValidatorError({
            type: ErrorType.CRITICAL,
            message: `Endpoint response cannot be parsed: ${e}`,
          }),
        ];
      }
    }
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
      response,
      errors: data.errors.map((error) => error?.mapError()),
      description: data.description,
    };
  };

  public validateError = <T>(data: ScenarioHelperData<T>, validator: ModelValidator): ScenarioResult => {
    const { result } = data;

    const errors = validator.validate(result);
    return this.handleResult({
      ...data,
      success: this.isSuccess(errors),
      errorExpected: true,
      errors,
    });
  };

  protected isSuccess = (errors: ValidatorError[]): boolean => {
    return !errors.some((e) => e.type === ErrorType.CRITICAL);
  };

  protected shouldTerminateValidation = (
    errors: ValidatorError[],
    uuid?: string,
    httpStatus?: number,
    expectedHttpStatus = 200,
  ): boolean => {
    return (httpStatus && httpStatus !== expectedHttpStatus) || (!uuid && !this.isSuccess(errors));
  };
}
