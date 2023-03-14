import { Scenario } from "../../Scenario.ts";
import { BookingCancellationScenarioHelper } from "../../../helpers/BookingCancellationScenarioHelper.ts";
import descriptions from "../../../consts/descriptions.ts";
import { ScenarioHelper } from "../../../helpers/ScenarioHelper.ts";
import { Booker } from "../../../Booker.ts";
import { ErrorType, ValidatorError } from "../../../../../validators/backendValidator/ValidatorHelpers.ts";
import { BookingContactSchema } from "@octocloud/types";
import { Context } from "../../../context/Context.ts";
import { SubRequestMapper } from "../../../../logging/SubRequestMapper.ts";

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
    const date = new Date();
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
      contact: {} as BookingContactSchema,
    });

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
    });

    context.subrequestMapper.map(result, context, date);

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
