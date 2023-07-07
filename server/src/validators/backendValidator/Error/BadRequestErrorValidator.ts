import { BAD_REQUEST, STATUS_BAD_REQUEST } from "../../../models/Error";
import { Result } from "../../../services/validation/api/types";
import {
  ModelValidator,
  NumberValidator,
  StringValidator,
  ValidatorError,
} from "../ValidatorHelpers";

export class BadRequestErrorValidator implements ModelValidator {
  public validate = (result: Result<any>): ValidatorError[] => {
    return [
      StringValidator.validate(`error`, result?.data?.error, {
        equalsTo: BAD_REQUEST,
      }),
      StringValidator.validate(`errorMessage`, result?.data?.errorMessage),
      NumberValidator.validate(`status`, result?.response?.status, {
        integer: true,
        equalsTo: STATUS_BAD_REQUEST,
      }),
    ].flatMap((v) => (v ? [v] : []));
  };
}
