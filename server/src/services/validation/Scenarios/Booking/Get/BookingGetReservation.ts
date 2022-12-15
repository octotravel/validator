import { Scenario } from "../../Scenario.ts";
import { Config } from "../../../config/Config.ts";
import { BookingGetScenarioHelper } from "../../../helpers/BookingGetScenarioHelper.ts";
import descriptions from "../../../consts/descriptions.ts";
import { ScenarioHelper } from "../../../helpers/ScenarioHelper.ts";
import { ErrorType, ValidatorError } from "../../../../../validators/backendValidator/ValidatorHelpers.ts";
import { Booker } from "../../../Booker.ts";

export class BookingGetReservationScenario implements Scenario {
  private booker = new Booker();
  private helper = new ScenarioHelper()
  private config = Config.getInstance();
  private apiClient = this.config.getApiClient();
  private bookingGetScenarionHelper = new BookingGetScenarioHelper();

  public validate = async () => {
    const name = "Get Booking - Reservation.ts";
    const description = descriptions.bookingGetReservation;
    const [bookableProduct] = this.config.productConfig.availableProducts;
    const resultReservation = await this.booker.createReservation(bookableProduct);
    if (resultReservation.data === null) {
      return this.helper.handleResult({
        result: resultReservation,
        name,
        description,
        errors: [new ValidatorError({type: ErrorType.CRITICAL, message: 'Reservation Creation Failed'})],
      })
    }

    const uuid = resultReservation.data.uuid
      const resultBooking = await this.apiClient.getBooking({
        uuid,
      })
      return this.bookingGetScenarionHelper.validateBookingGet(
        {
          result: resultBooking,
          name,
          description,
        },
      );
  };
}
