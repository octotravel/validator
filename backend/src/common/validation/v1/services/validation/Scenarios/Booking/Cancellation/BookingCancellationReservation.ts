import { ValidatorError, ErrorType } from '../../../../../validators/backendValidator/ValidatorHelpers';
import { Scenario, ScenarioResult } from '../../Scenario';
import { BookingCancellationScenarioHelper } from '../../../helpers/BookingCancellationScenarioHelper';
import descriptions from '../../../consts/descriptions';
import { ScenarioHelper } from '../../../helpers/ScenarioHelper';
import { Booker } from '../../../Booker';
import { Context } from '../../../context/Context';

export class BookingCancellationReservationScenario implements Scenario {
  private readonly helper = new ScenarioHelper();
  private readonly booker = new Booker();
  private readonly bookingCancellationScenarioHelper = new BookingCancellationScenarioHelper();

  public validate = async (context: Context): Promise<ScenarioResult> => {
    const apiClient = context.getApiClient();
    const name = 'Booking Cancellation - Reservation';
    const description = descriptions.bookingCancellationReservation;
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

    const result = await apiClient.cancelBooking(
      {
        uuid: resultReservation.data.uuid,
        reason: 'Reason for cancellation',
      },
      context,
    );

    return this.bookingCancellationScenarioHelper.validateBookingCancellation(
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
