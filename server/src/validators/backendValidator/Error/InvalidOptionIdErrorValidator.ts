import { Result } from './../../../services/validation/api/types';
import { NumberValidator } from "./../ValidatorHelpers";
import { INVALID_OPTION_ID, STATUS_BAD_REQUEST } from "./../../../models/Error";
import {
  ModelValidator,
  StringValidator,
  ValidatorError,
} from "../ValidatorHelpers";

export class InvalidOptionIdErrorValidator implements ModelValidator {
  public validate = (result: Result<any>): ValidatorError[] => {
    return [
      StringValidator.validate(`error`, result?.data?.error, {
        equalsTo: INVALID_OPTION_ID,
      }),
      StringValidator.validate(`errorMessage`, result?.data?.errorMessage),
      StringValidator.validate(`optionId`, result?.data?.optionId),
      NumberValidator.validate(`status`, result?.response?.status, {
        integer: true,
        equalsTo: STATUS_BAD_REQUEST,
      }),
    ].flatMap((v) => (v ? [v] : []));
  };
}
