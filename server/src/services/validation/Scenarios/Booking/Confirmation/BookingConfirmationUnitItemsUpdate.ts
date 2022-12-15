import { Scenario } from "../../Scenario.ts";
import { BookingConfirmationScenarioHelper } from "../../../helpers/BookingConfirmationScenarioHelper.ts";
import { Config } from "../../../config/Config.ts";
import descriptions from "../../../consts/descriptions.ts";
import { ScenarioHelper } from "../../../helpers/ScenarioHelper.ts";
import { Booker } from "../../../Booker.ts";
import { ErrorType, ValidatorError } from "../../../../../validators/backendValidator/ValidatorHelpers.ts";

export class BookingConfirmationUnitItemUpdateScenario
  implements Scenario
{
  private helper = new ScenarioHelper()
  private booker = new Booker();
  private config = Config.getInstance();
  private apiClient = this.config.getApiClient();
  private bookingConfirmationScenarioHelper =
    new BookingConfirmationScenarioHelper();

  public validate = async () => {
    const name = `Booking Confirmation unitItems update`;
    const description = descriptions.bookingConfirmationUnitItemsUpdate;
    const [bookableProduct] = this.config.productConfig.availableProducts;

    const resultReservation = await this.booker.createReservation(bookableProduct, {
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
    const unitItems = bookableProduct.getValidUnitItems({ quantity: 3 });
    const result = await this.apiClient.bookingConfirmation({
      uuid: resultReservation.data.uuid,
      contact: {
        firstName: "John",
        lastName: "Doe",
        emailAddress: "johndoe@mail.com",
        fullName: "John Doe",
        notes: "Test note",
      },
      // TODO: make it dynamic
      resellerReference: "RESELLERREF#1",
      unitItems,
    });

    return this.bookingConfirmationScenarioHelper.validateBookingConfirmation(
      {
        result,
        name,
        description,
      },
      resultReservation.data
    );
  };
}
