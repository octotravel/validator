import { Scenario } from "../../Scenario.ts";
import { InvalidUnitIdErrorValidator } from "../../../../../validators/backendValidator/Error/InvalidUnitIdErrorValidator.ts";
import { BookingConfirmationScenarioHelper } from "../../../helpers/BookingConfirmationScenarioHelper.ts";
import descriptions from "../../../consts/descriptions.ts";
import { ErrorType, ValidatorError } from "../../../../../validators/backendValidator/ValidatorHelpers.ts";
import { ScenarioHelper } from "../../../helpers/ScenarioHelper.ts";
import { Booker } from "../../../Booker.ts";
import { Context } from "../../../context/Context.ts";

export class BookingConfirmationInvalidUnitIdScenario implements Scenario {
  private helper = new ScenarioHelper()
  private booker = new Booker();

  private bookingConfirmationScenarioHelper =
    new BookingConfirmationScenarioHelper();

  public validate = async (context: Context) => {
    const apiClient = context.getApiClient();
    const name = "Booking Confirmation Invalid Unit ID (400 INVALID_UNIT_ID)";
    const description = descriptions.invalidUnitId;
    const [bookableProduct] = context.productConfig.availableProducts;

    const resultReservation = await this.booker.createReservation(bookableProduct, 
      context,
      {
      unitItemsQuantity: 2,
    });
    if (resultReservation.data === null) {
      return this.helper.handleResult({
        result: resultReservation,
        name,
        description,
        errors: [new ValidatorError({type: ErrorType.CRITICAL, message: 'Reservation Creation Failed'})],
      })
    }
    const unitItems = bookableProduct.getInvalidUnitItems({ quantity: 2 });
    const result = await apiClient.bookingConfirmation({
      uuid: resultReservation.data.uuid,
      unitItems,
      contact: {
        firstName: "John",
        lastName: "Doe",
        emailAddress: "johndoe@mail.com",
        fullName: "John Doe",
        notes: "Test note",
      },
    });

    return this.bookingConfirmationScenarioHelper.validateError(
      {
        result,
        name,
        description,
      },
      new InvalidUnitIdErrorValidator()
    );
  };
}
