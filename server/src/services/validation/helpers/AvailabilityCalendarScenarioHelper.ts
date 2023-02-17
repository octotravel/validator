import { ScenarioResult } from "./../Scenarios/Scenario.ts";
import * as R from "https://esm.sh/ramda@0.28.0";
import { AvailabilityCalendar, Product } from "https://esm.sh/@octocloud/types@1.4.8";
import { ScenarioHelper, ScenarioHelperData } from "./ScenarioHelper.ts";
import {
  ErrorType,
  ValidatorError,
} from "./../../../validators/backendValidator/ValidatorHelpers.ts";
import { AvailabilityCalendarValidator } from "../../../validators/backendValidator/AvailabilityCalendar/AvailabilityCalendarValidator.ts";
import { Context } from "../context/Context.ts";

export class AvailabilityCalendarScenarioHelper extends ScenarioHelper {
  public validateAvailability = (
    data: ScenarioHelperData<AvailabilityCalendar[]>,
    product: Product,
    context: Context
  ): ScenarioResult => {
    const { result } = data;
    const availabilities = result.data ?? [];
    const response = result?.response;
    if (response?.error) {
      return this.handleResult({
        ...data,
        success: false,
        errors: [],
      });
    }
    const errors = [];

    if (R.isEmpty(availabilities)) {
      errors.push(
        new ValidatorError({
          type: ErrorType.CRITICAL,
          message: "No availabilities were provided",
        })
      );
    }

    const validationErrors = availabilities
      .map((availability: any, i: number) =>
        new AvailabilityCalendarValidator({
          capabilities: context.getCapabilityIDs(),
          path: `[${i}]`,
          availabilityType: product.availabilityType,
        }).validate(availability)
      )
      .flat();

    errors.push(...validationErrors);

    return this.handleResult({
      ...data,
      success: this.isSuccess(errors),
      errors: errors,
    });
  };
}
