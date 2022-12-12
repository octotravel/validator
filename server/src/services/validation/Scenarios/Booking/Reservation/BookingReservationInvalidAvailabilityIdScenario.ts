import { InvalidAvailabilityIdErrorValidator } from "./../../../../../validators/backendValidator/Error/InvalidAvailabilityIdErrorValidator.ts";
import { Scenario } from "../../Scenario.ts";
import { BookingReservationScenarioHelper } from "../../../helpers/BookingReservationScenarioHelper.ts";
import { Booking } from "npm:@octocloud/types@^1.3.1";
import { Result } from "../../../api/types.ts";
import descriptions from "../../../consts/descriptions.ts";

export class BookingReservationInvalidAvailabilityIdScenario
  implements Scenario
{
  private result: Result<Booking>;
  constructor({ result }: { result: Result<Booking> }) {
    this.result = result;
  }
  private bookingReservationScenarioHelper =
    new BookingReservationScenarioHelper();

  public validate = async () => {
    const name =
      "Booking Reservation Invalid Availability ID (400 INVALID_AVAILABILITY_ID).ts";
    const description = descriptions.bookingReservationInvalidAvailabilityId;

    return this.bookingReservationScenarioHelper.validateError(
      {
        result: this.result,
        name,
        description,
      },
      new InvalidAvailabilityIdErrorValidator()
    );
  };
}
