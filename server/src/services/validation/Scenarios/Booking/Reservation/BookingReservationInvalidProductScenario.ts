import { Scenario } from "../../Scenario.ts";
import { InvalidProductIdErrorValidator } from "../../../../../validators/backendValidator/Error/InvalidProductIdErrorValidator.ts";
import { BookingReservationScenarioHelper } from "../../../helpers/BookingReservationScenarioHelper.ts";
import { Booking } from "npm:@octocloud/types@^1.3.1";
import { Result } from "../../../api/types.ts";
import descriptions from "../../../consts/descriptions.ts";

export class BookingReservationInvalidProductScenario implements Scenario {
  private result: Result<Booking>;
  constructor({ result }: { result: Result<Booking> }) {
    this.result = result;
  }
  private bookingReservationScenarioHelper =
    new BookingReservationScenarioHelper();

  public validate = async () => {
    const name = "Booking Reservation Invalid Product (400 INVALID_PRODUCT_ID).ts";
    const description = descriptions.invalidProduct;

    return this.bookingReservationScenarioHelper.validateError(
      {
        result: this.result,
        name,
        description,
      },
      new InvalidProductIdErrorValidator()
    );
  };
}
