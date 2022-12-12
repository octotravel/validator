import { Result } from "./../../../api/types.ts";
import { Booking } from "npm:@octocloud/types@^1.3.1";
import { Scenario } from "../../Scenario.ts";
import { BookingReservationScenarioHelper } from "../../../helpers/BookingReservationScenarioHelper.ts";
import descriptions from "../../../consts/descriptions.ts";

export class BookingReservationScenario implements Scenario {
  private result: Result<Booking>;
  constructor({ result }: { result: Result<Booking> }) {
    this.result = result;
  }
  private bookingReservationScenarioHelper =
    new BookingReservationScenarioHelper();
  public validate = async () => {
    const name = `Booking Reservation`;
    const description = descriptions.bookingReservation;

    return this.bookingReservationScenarioHelper.validateBookingReservation(
      {
        result: this.result,
        name,
        description,
      },
    );
  };
}
