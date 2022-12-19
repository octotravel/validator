import { Booking } from "https://esm.sh/@octocloud/types@1.3.1";
import { BookingValidator } from "../../../validators/backendValidator/Booking/BookingValidator.ts";
import {
  ScenarioHelper,
  ScenarioHelperData,
} from "./ScenarioHelper.ts";

export class BookingGetScenarioHelper extends ScenarioHelper {
  public validateBookingGet = (
    data: ScenarioHelperData<Booking>,
  ) => {
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
      capabilities: this.config.getCapabilityIDs(),
    }).validate(result.data);
    return this.handleResult({
      ...data,
      errors,
    });
  };
}
