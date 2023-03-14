import { Scenario } from "../../Scenario.ts";
import { BookingGetScenarioHelper } from "../../../helpers/BookingGetScenarioHelper.ts";
import descriptions from "../../../consts/descriptions.ts";
import { ScenarioHelper } from "../../../helpers/ScenarioHelper.ts";
import { ErrorType, ValidatorError } from "../../../../../validators/backendValidator/ValidatorHelpers.ts";
import { Booker } from "../../../Booker.ts";
import { Context } from "../../../context/Context.ts";

export class BookingGetReservationScenario implements Scenario {
  private booker = new Booker();
  private helper = new ScenarioHelper()
  private bookingGetScenarionHelper = new BookingGetScenarioHelper();

  public validate = async (context: Context) => {
    const apiClient = context.getApiClient();
    const name = "Get Booking - Reservation.ts";
    const description = descriptions.bookingGetReservation;
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

    const uuid = resultReservation.data.uuid
      const resultBooking = await apiClient.getBooking({
        uuid,
      }, context)
    
    return this.bookingGetScenarionHelper.validateBookingGet(
      {
        result: resultBooking,
        name,
        description,
      },
      context
    );
  };
}
