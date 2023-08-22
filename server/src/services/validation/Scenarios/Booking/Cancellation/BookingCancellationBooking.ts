import { Scenario } from "../../Scenario";
import { BookingCancellationScenarioHelper } from "../../../helpers/BookingCancellationScenarioHelper";
import descriptions from "../../../consts/descriptions";
import { ScenarioHelper } from "../../../helpers/ScenarioHelper";
import { Booker } from "../../../Booker";
import { ErrorType, ValidatorError } from "../../../../../validators/backendValidator/ValidatorHelpers";
import { BookingContactSchema } from "@octocloud/types";
import { Context } from "../../../context/Context";

export class BookingCancellationBookingScenario implements Scenario {
  private helper = new ScenarioHelper()
  private booker = new Booker();
  private bookingCancellationScenarioHelper =
    new BookingCancellationScenarioHelper();

  public validate = async (context: Context) => {
    const apiClient = context.getApiClient();
    const name = `Booking Cancellation - Booking`;
    const description = descriptions.bookingCancellationBooking;
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

    const resultConfirmation = await apiClient.bookingConfirmation({
      uuid: resultReservation.data.uuid,
      contact: {
        firstName: "John",
        lastName: "Doe",
        emailAddress: "johndoe@mail.com",
        fullName: "John Doe",
        notes: "Test note",
      }
    }, context);

    if (resultConfirmation.data === null) {
      return this.helper.handleResult({
        result: resultConfirmation,
        name,
        description,
        errors: [new ValidatorError({type: ErrorType.CRITICAL, message: 'Reservation Confirm Failed'})],
      })
    }
    const result = await apiClient.cancelBooking({
      uuid: resultConfirmation.data.uuid,
      reason: "Reason for cancellation",
    }, context);

    return this.bookingCancellationScenarioHelper.validateBookingCancellation(
      {
        result,
        name,
        description,
      },
      resultConfirmation.data,
      context
    );
  };
}
