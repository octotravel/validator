import { Result } from './../../../services/validation/api/types.ts';
import { NumberValidator } from "./../ValidatorHelpers.ts";
import {
  INVALID_AVAILABILITY_ID,
  STATUS_BAD_REQUEST,
} from "../../../models/Error.ts";
import {
  ModelValidator,
  StringValidator,
  ValidatorError,
} from "../ValidatorHelpers.ts";

export class InvalidAvailabilityIdErrorValidator implements ModelValidator {
  public validate = (result: Result<any>): ValidatorError[] => {
    return [
      StringValidator.validate(`error`, result?.data?.error, {
        equalsTo: INVALID_AVAILABILITY_ID,
      }),
      StringValidator.validate(`errorMessage`, result?.data?.errorMessage),
      StringValidator.validate(`availabilityId`, result?.data?.availabilityId),
      NumberValidator.validate(`status`, result?.response?.status, {
        integer: true,
        equalsTo: STATUS_BAD_REQUEST,
      }),
    ].flatMap((v) => (v ? [v] : []));
  };
}
