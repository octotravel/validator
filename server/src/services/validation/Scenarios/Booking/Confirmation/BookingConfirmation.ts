import { Scenario } from "../../Scenario.ts";
import { BookingConfirmationScenarioHelper } from "../../../helpers/BookingConfirmationScenarioHelper.ts";
import descriptions from "../../../consts/descriptions.ts";
import { Booker } from "../../../Booker.ts";
import { ScenarioHelper } from "../../../helpers/ScenarioHelper.ts";
import { ErrorType, ValidatorError } from "../../../../../validators/backendValidator/ValidatorHelpers.ts";
import { Context } from "../../../context/Context.ts";

export class BookingConfirmationScenario implements Scenario {
  private helper = new ScenarioHelper()
  private booker = new Booker();
  private bookingConfirmationScenarioHelper =
    new BookingConfirmationScenarioHelper();

  public validate = async (context: Context) => {
    const apiClient = context.getApiClient();
    const name = `Booking Confirmation`;
    const description = descriptions.bookingConfirmation;
    const [bookableProduct] = context.productConfig.availableProducts;

    const resultReservation = await this.booker.createReservation(bookableProduct,
      context);
    if (resultReservation.data === null) {
      return this.helper.handleResult({
        result: resultReservation,
        name,
        description,
        errors: [new ValidatorError({type: ErrorType.CRITICAL, message: 'Reservation Creation Failed'})],
      })
    }

    const result = await apiClient.bookingConfirmation({
      uuid: resultReservation.data.uuid,
      contact: {
        firstName: "John",
        lastName: "Doe",
        emailAddress: "johndoe@mail.com",
        fullName: "John Doe",
        notes: "Test note",
      },
      resellerReference: "RESELLERREF#1",
    });

    return this.bookingConfirmationScenarioHelper.validateBookingConfirmation(
      {
        result,
        name,
        description,
      },
      resultReservation.data,
      context
    );
  };
}
