import { ErrorType, ValidatorError } from './../../../validators/backendValidator/ValidatorHelpers.ts';
import * as R from "https://esm.sh/ramda@0.28.0";
import { Availability, Product } from "https://esm.sh/@octocloud/types@1.3.1";
import { AvailabilityValidator } from "../../../validators/backendValidator/Availability/AvailabilityValidator.ts";
import { ScenarioHelper, ScenarioHelperData } from "./ScenarioHelper.ts";
import { Context } from '../context/Context.ts';

export class AvailabilityScenarioHelper extends ScenarioHelper {
  public validateAvailability = (
    data: ScenarioHelperData<Availability[]>,
    product: Product,
    context: Context
  ) => {
    const validator = new AvailabilityValidator({
      capabilities: context.getCapabilityIDs(),
      availabilityType: product.availabilityType,
    });
    const { result } = data;
    if (result?.response?.error) {
      return this.handleResult({
        ...data,
        success: false,
        errors: [],
      });
    }
    const availabilities = result?.data ?? [];

    const errors = availabilities.map(validator.validate).flat();

    if (R.isEmpty(availabilities)) {
      errors.push(new ValidatorError({
        type: ErrorType.CRITICAL,
        message: `no availability returned`,
      }))
    }

    return this.handleResult({
      ...data,
      errors,
    });
  };
}
