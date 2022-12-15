import { Result } from './../../../services/validation/api/types.ts';
import { NumberValidator } from "./../ValidatorHelpers.ts";
import {
  STATUS_BAD_REQUEST,
  UNPROCESSABLE_ENTITY,
} from "../../../models/Error.ts";
import {
  ModelValidator,
  StringValidator,
  ValidatorError,
} from "../ValidatorHelpers.ts";

export class UnprocessableEntityErrorValidator implements ModelValidator {
  public validate = (result: Result<any>): ValidatorError[] => {
    return [
      StringValidator.validate(`error`, result?.data?.error, {
        equalsTo: UNPROCESSABLE_ENTITY,
      }),
      StringValidator.validate(`errorMessage`, result?.data?.errorMessage),
      NumberValidator.validate(`status`, result?.response?.status, {
        integer: true,
        equalsTo: STATUS_BAD_REQUEST,
      }),
    ].flatMap((v) => (v ? [v] : []));
  };
}
