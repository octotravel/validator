import { Availability, Product } from '@octocloud/types';
import * as R from 'ramda';
import { STATUS_SUCCESS } from '../../../models/Error';
import { AvailabilityValidator } from '../../../validators/backendValidator/Availability/AvailabilityValidator';
import { ResponseStatusValidator } from '../../../validators/backendValidator/Response/ResponseStatusValidator';
import { ErrorType, ValidatorError } from '../../../validators/backendValidator/ValidatorHelpers';
import { Context } from '../context/Context';
import { ScenarioResult } from '../Scenarios/Scenario';
import { ScenarioHelper, ScenarioHelperData } from './ScenarioHelper';
export class AvailabilityScenarioHelper extends ScenarioHelper {
  public validateAvailability = (
    data: ScenarioHelperData<Availability[]>,
    product: Product,
    context: Context,
  ): ScenarioResult => {
    const validator = new AvailabilityValidator({
      capabilities: context.getCapabilityIDs(),
      availabilityType: product.availabilityType,
    });
    const { result } = data;
    const statusErrors = new ResponseStatusValidator({ expectedStatus: STATUS_SUCCESS }).validate(result);
    if (!result?.response || result.response.error) {
      return this.handleResult({
        ...data,
        errors: statusErrors,
      });
    }
    const availabilities = Array.isArray(result?.data) ? result?.data : [];
    let errors = [];

    if (!Array.isArray(availabilities)) {
      errors.push(
        new ValidatorError({
          type: ErrorType.CRITICAL,
          message: 'availability response is not array',
        }),
      );
    } else {
      errors = availabilities.flatMap(validator.validate);

      if (R.isEmpty(availabilities)) {
        errors.push(
          new ValidatorError({
            type: ErrorType.CRITICAL,
            message: 'no availability returned',
          }),
        );
      }
    }

    return this.handleResult({
      ...data,
      errors: [...statusErrors, ...errors],
    });
  };
}
