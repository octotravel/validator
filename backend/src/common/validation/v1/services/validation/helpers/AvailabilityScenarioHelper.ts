import { ErrorType, ValidatorError } from './../../../validators/backendValidator/ValidatorHelpers';
import * as R from 'ramda';
import { Availability, Product } from '@octocloud/types';
import { AvailabilityValidator } from '../../../validators/backendValidator/Availability/AvailabilityValidator';
import { ScenarioHelper, ScenarioHelperData } from './ScenarioHelper';
import { Context } from '../context/Context';
import { ScenarioResult } from '../Scenarios/Scenario';

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
      errors.push(
        new ValidatorError({
          type: ErrorType.CRITICAL,
          message: 'no availability returned',
        }),
      );
    }

    return this.handleResult({
      ...data,
      errors,
    });
  };
}
