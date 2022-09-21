import { Booking } from "@octocloud/types";
import { BookingValidator } from "../../../validators/backendValidator/Booking/BookingValidator";
import {
  ScenarioHelper,
  ScenarioHelperData,
} from "./ScenarioHelper";

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
