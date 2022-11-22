import { Booking } from "@octocloud/types";
import { Scenario } from "../../Scenario";
import { InvalidOptionIdErrorValidator } from "../../../../../validators/backendValidator/Error/InvalidOptionIdErrorValidator";
import { BookingReservationScenarioHelper } from "../../../helpers/BookingReservationScenarioHelper";
import { Result } from "../../../api/types";
import descriptions from "../../../consts/descriptions";

export class BookingReservationInvalidOptionScenario implements Scenario {
  private result: Result<Booking>;
  constructor({ result }: { result: Result<Booking> }) {
    this.result = result;
  }
  private bookingReservationScenarioHelper =
    new BookingReservationScenarioHelper();

  public validate = async () => {
    const name = "Booking Reservation Invalid Option (400 INVALID_OPTION_ID)";
    const description = descriptions.invalidOption;

    return this.bookingReservationScenarioHelper.validateError(
      {
        result: this.result,
        name,
        description,
      },
      new InvalidOptionIdErrorValidator()
    );
  };
}
