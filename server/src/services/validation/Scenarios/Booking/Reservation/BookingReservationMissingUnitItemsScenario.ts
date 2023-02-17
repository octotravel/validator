import { Booking } from "https://esm.sh/@octocloud/types@1.4.8";
import { Scenario } from "../../Scenario.ts";
import { UnprocessableEntityErrorValidator } from "../../../../../validators/backendValidator/Error/UnprocessableEntityErrorValidator.ts";
import { BookingReservationScenarioHelper } from "../../../helpers/BookingReservationScenarioHelper.ts";
import { Result } from "../../../api/types.ts";
import descriptions from "../../../consts/descriptions.ts";

export class BookingReservationMissingUnitItemsScenario
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
      "Booking Reservation Missing UnitItems (400 UNPROCESSABLE_ENTITY)";
    const description = descriptions.bookingReservationMissingUnitItems;

    return this.bookingReservationScenarioHelper.validateError(
      {
        result: this.result,
        name,
        description,
      },
      new UnprocessableEntityErrorValidator()
    );
  };
}
