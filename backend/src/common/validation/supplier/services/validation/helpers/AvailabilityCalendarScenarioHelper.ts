import { AvailabilityCalendar, Product } from '@octocloud/types';
import * as R from 'ramda';
import { STATUS_SUCCESS } from '../../../models/Error';
import { AvailabilityCalendarValidator } from '../../../validators/backendValidator/AvailabilityCalendar/AvailabilityCalendarValidator';
import { ResponseStatusValidator } from '../../../validators/backendValidator/Response/ResponseStatusValidator';
import { ErrorType, ValidatorError } from '../../../validators/backendValidator/ValidatorHelpers';
import { Context } from '../context/Context';
import { ScenarioResult } from '../Scenarios/Scenario';
import { ScenarioHelper, ScenarioHelperData } from './ScenarioHelper';

export class AvailabilityCalendarScenarioHelper extends ScenarioHelper {
  public validateAvailability = (
    data: ScenarioHelperData<AvailabilityCalendar[]>,
    product: Product,
    context: Context,
  ): ScenarioResult => {
    const { result } = data;
    const availabilities = Array.isArray(result?.data) ? result?.data : [];
    const response = result?.response;
    const statusErrors = new ResponseStatusValidator({ expectedStatus: STATUS_SUCCESS }).validate(result);
    if (!response || response.error) {
      return this.handleResult({
        ...data,
        errors: statusErrors,
      });
    }
    const errors = [...statusErrors];

    if (R.isEmpty(availabilities)) {
      errors.push(
        new ValidatorError({
          type: ErrorType.CRITICAL,
          message: 'No availabilities were provided',
        }),
      );
    }

    const validationErrors = availabilities.flatMap((availability, i: number) =>
      new AvailabilityCalendarValidator({
        capabilities: context.getCapabilityIDs(),
        path: `[${i}]`,
        availabilityType: product.availabilityType,
      }).validate(availability),
    );

    errors.push(...validationErrors);

    return this.handleResult({
      ...data,
      success: this.isSuccess(errors),
      errors,
    });
  };
}
