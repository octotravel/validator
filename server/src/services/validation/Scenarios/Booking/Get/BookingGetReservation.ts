import { Scenario } from "../../Scenario";
import { BookingGetScenarioHelper } from "../../../helpers/BookingGetScenarioHelper";
import descriptions from "../../../consts/descriptions";
import { ScenarioHelper } from "../../../helpers/ScenarioHelper";
import { ErrorType, ValidatorError } from "../../../../../validators/backendValidator/ValidatorHelpers";
import { Booker } from "../../../Booker";
import { Context } from "../../../context/Context";

export class BookingGetReservationScenario implements Scenario {
  private booker = new Booker();
  private helper = new ScenarioHelper()
  private bookingGetScenarionHelper = new BookingGetScenarioHelper();

  public validate = async (context: Context) => {
    const apiClient = context.getApiClient();
    const name = "Get Booking - Reservation";
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
      context,
      context.shouldNotHydrate
    );
  };
}
