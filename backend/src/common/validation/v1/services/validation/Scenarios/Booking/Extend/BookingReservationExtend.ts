import { Scenario, ScenarioResult } from '../../Scenario';
import { BookingExtendScenarioHelper } from '../../../helpers/BookingExtendScenarioHelper';
import descriptions from '../../../consts/descriptions';
import { Booker } from '../../../Booker';
import { ScenarioHelper } from '../../../helpers/ScenarioHelper';
import { ErrorType, ValidatorError } from '../../../../../validators/backendValidator/ValidatorHelpers';
import { Context } from '../../../context/Context';

export class BookingReservationExtendScenario implements Scenario {
  private readonly booker = new Booker();
  private readonly helper = new ScenarioHelper();
  private readonly bookingExtendScenarioHelper = new BookingExtendScenarioHelper();

  public validate = async (context: Context): Promise<ScenarioResult> => {
    const apiClient = context.getApiClient();
    const name = 'Extend Reservation';
    const description = descriptions.bookingReservationExtend;
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
    const result = await apiClient.bookingExtend(
      {
        uuid: resultReservation.data.uuid,
        expirationMinutes: 31,
      },
      context,
    );

    return this.bookingExtendScenarioHelper.validateBookingExtend(
      {
        result,
        name,
        description,
      },
      resultReservation.data,
      context,
    );
  };
}
