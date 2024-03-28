import { ScenarioResult } from './../Scenarios/Scenario';
import * as R from 'ramda';
import { AvailabilityCalendar, Product } from '@octocloud/types';
import { ScenarioHelper, ScenarioHelperData } from './ScenarioHelper';
import { ErrorType, ValidatorError } from './../../../validators/backendValidator/ValidatorHelpers';
import { AvailabilityCalendarValidator } from '../../../validators/backendValidator/AvailabilityCalendar/AvailabilityCalendarValidator';
import { Context } from '../context/Context';

export class AvailabilityCalendarScenarioHelper extends ScenarioHelper {
  public validateAvailability = (
    data: ScenarioHelperData<AvailabilityCalendar[]>,
    product: Product,
    context: Context,
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
          message: 'No availabilities were provided',
        }),
      );
    }

    const validationErrors = availabilities
      .map((availability: any, i: number) =>
        new AvailabilityCalendarValidator({
          capabilities: context.getCapabilityIDs(),
          path: `[${i}]`,
          availabilityType: product.availabilityType,
        }).validate(availability),
      )
      .flat();

    errors.push(...validationErrors);

    return this.handleResult({
      ...data,
      success: this.isSuccess(errors),
      errors,
    });
  };
}
