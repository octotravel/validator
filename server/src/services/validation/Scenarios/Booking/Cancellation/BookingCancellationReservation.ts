import { ValidatorError, ErrorType } from './../../../../../validators/backendValidator/ValidatorHelpers.ts';
import { Scenario } from "../../Scenario.ts";
import { BookingCancellationScenarioHelper } from "../../../helpers/BookingCancellationScenarioHelper.ts";
import descriptions from "../../../consts/descriptions.ts";
import { ScenarioHelper } from "../../../helpers/ScenarioHelper.ts";
import { Booker } from "../../../Booker.ts";
import { Context } from '../../../context/Context.ts';

export class BookingCancellationReservationScenario
  implements Scenario
{
  private helper = new ScenarioHelper()
  private booker = new Booker();
  private bookingCancellationScenarioHelper =
    new BookingCancellationScenarioHelper();

  public validate = async (context: Context) => {
    const apiClient = context.getApiClient();
    const name = `Booking Cancellation - Reservation`;
    const description = descriptions.bookingCancellationReservation;
    const [bookableProduct] = context.productConfig.availableProducts;

    const resultReservation = await this.booker.createReservation(
      bookableProduct,
      context
    );

    if (resultReservation.data === null) {
      return this.helper.handleResult({
        result: resultReservation,
        name,
        description,
        errors: [new ValidatorError({type: ErrorType.CRITICAL, message: 'Reservation Creation Failed'})],
      })
    }

      
    const result = await apiClient.cancelBooking({
      uuid: resultReservation.data.uuid,
      reason: "Reason for cancellation",
    });
    

    return this.bookingCancellationScenarioHelper.validateBookingCancellation(
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
