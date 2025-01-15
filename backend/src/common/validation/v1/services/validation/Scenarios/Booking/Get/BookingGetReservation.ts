import { ErrorType, ValidatorError } from '../../../../../validators/backendValidator/ValidatorHelpers';
import { Booker } from '../../../Booker';
import descriptions from '../../../consts/descriptions';
import { Context } from '../../../context/Context';
import { BookingGetScenarioHelper } from '../../../helpers/BookingGetScenarioHelper';
import { ScenarioHelper } from '../../../helpers/ScenarioHelper';
import { Scenario, ScenarioResult } from '../../Scenario';

export class BookingGetReservationScenario implements Scenario {
  private readonly booker = new Booker();
  private readonly helper = new ScenarioHelper();
  private readonly bookingGetScenarionHelper = new BookingGetScenarioHelper();

  public validate = async (context: Context): Promise<ScenarioResult> => {
    const apiClient = context.getApiClient();
    const name = 'Get Booking - Reservation';
    const description = descriptions.bookingGetReservation;
    const [bookableProduct] = context.productConfig.availableProducts;

    const resultReservation = await this.booker.createReservation(bookableProduct, context);
    if (resultReservation.data === null) {
      return this.helper.handleResult({
        result: resultReservation,
        name,
        description,
        errors: [new ValidatorError({ type: ErrorType.CRITICAL, message: 'Reservation Creation Failed' })],
      });
    }

    const uuid = resultReservation.data.uuid;
    const resultBooking = await apiClient.getBooking(
      {
        uuid,
      },
      context,
    );

    return this.bookingGetScenarionHelper.validateBookingGet(
      {
        result: resultBooking,
        name,
        description,
      },
      context,
      context.shouldNotHydrate,
    );
  };
}
