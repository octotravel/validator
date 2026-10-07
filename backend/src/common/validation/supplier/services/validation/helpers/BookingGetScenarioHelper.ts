import { Booking } from '@octocloud/types';
import { STATUS_SUCCESS } from '../../../models/Error';
import { BookingValidator } from '../../../validators/backendValidator/Booking/BookingValidator';
import { ResponseStatusValidator } from '../../../validators/backendValidator/Response/ResponseStatusValidator';
import { Context } from '../context/Context';
import { ScenarioResult } from '../Scenarios/Scenario';
import { ScenarioHelper, ScenarioHelperData } from './ScenarioHelper';

export class BookingGetScenarioHelper extends ScenarioHelper {
  public validateBookingGet = (
    data: ScenarioHelperData<Booking>,
    context: Context,
    shouldNotHydrate = false,
  ): ScenarioResult => {
    const { result } = data;
    const response = result?.response;
    const statusErrors = new ResponseStatusValidator({ expectedStatus: STATUS_SUCCESS }).validate(result);
    if (!response || response.error) {
      return this.handleResult({
        ...data,
        errors: statusErrors,
      });
    }

    const errors = [
      ...statusErrors,
      ...new BookingValidator({
        capabilities: context.getCapabilityIDs(),
        shouldNotHydrate,
      }).validate(result.data),
    ];
    return this.handleResult({
      ...data,
      errors,
    });
  };
}
