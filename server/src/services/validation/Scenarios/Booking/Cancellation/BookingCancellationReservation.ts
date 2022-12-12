import { ValidatorError, ErrorType } from './../../../../../validators/backendValidator/ValidatorHelpers.ts';
import { Scenario } from "../../Scenario.ts";
import { BookingCancellationScenarioHelper } from "../../../helpers/BookingCancellationScenarioHelper.ts";
import { Config } from "../../../config/Config.ts";
import descriptions from "../../../consts/descriptions.ts";
import { ScenarioHelper } from "../../../helpers/ScenarioHelper.ts";
import { Booker } from "../../../Booker.ts";

export class BookingCancellationReservationScenario
  implements Scenario
{
  private helper = new ScenarioHelper()
  private booker = new Booker();
  private config = Config.getInstance();
  private apiClient = this.config.getApiClient();
  private bookingCancellationScenarioHelper =
    new BookingCancellationScenarioHelper();

  public validate = async () => {
    const name = `Booking Cancellation - Reservation`;
    const description = descriptions.bookingCancellationReservation;
    const [bookableProduct] = this.config.productConfig.availableProducts;

    const resultReservation = await this.booker.createReservation(
      bookableProduct
    );

    if (resultReservation.data === null) {
      return this.helper.handleResult({
        result: resultReservation,
        name,
        description,
        errors: [new ValidatorError({type: ErrorType.CRITICAL, message: 'Reservation Creation Failed'})],
      })
    }

      
    const result = await this.apiClient.cancelBooking({
      uuid: resultReservation.data.uuid,
      reason: "Reason for cancellation",
    });
    

    return this.bookingCancellationScenarioHelper.validateBookingCancellation(
      {
        result,
        name,
        description,
      },
      resultReservation.data
    );
  };
}
