import { Booking } from '@octocloud/types';
import { BookingValidator } from '../../../validators/backendValidator/Booking/BookingValidator';
import { Context } from '../context/Context';
import { ScenarioHelper, ScenarioHelperData } from './ScenarioHelper';
import { ScenarioResult } from '../Scenarios/Scenario';

export class BookingGetScenarioHelper extends ScenarioHelper {
  public validateBookingGet = (
    data: ScenarioHelperData<Booking>,
    context: Context,
    shouldNotHydrate: boolean = false,
  ): ScenarioResult => {
    const { result } = data;
    const response = result?.response;
    if (response?.error) {
      return this.handleResult({
        ...data,
        success: false,
        errors: [],
      });
    }

    const errors = new BookingValidator({
      capabilities: context.getCapabilityIDs(),
      shouldNotHydrate,
    }).validate(result.data);
    return this.handleResult({
      ...data,
      errors,
    });
  };
}
