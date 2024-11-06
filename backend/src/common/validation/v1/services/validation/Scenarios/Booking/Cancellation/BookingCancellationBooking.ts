import { Scenario, ScenarioResult } from '../../Scenario';
import { BookingCancellationScenarioHelper } from '../../../helpers/BookingCancellationScenarioHelper';
import descriptions from '../../../consts/descriptions';
import { ScenarioHelper } from '../../../helpers/ScenarioHelper';
import { Booker } from '../../../Booker';
import { ErrorType, ValidatorError } from '../../../../../validators/backendValidator/ValidatorHelpers';
import { Context } from '../../../context/Context';
import { ReferenceHelper } from '../../../../../helpers/ReferenceHelper';

export class BookingCancellationBookingScenario implements Scenario {
  private readonly helper = new ScenarioHelper();
  private readonly booker = new Booker();
  private readonly bookingCancellationScenarioHelper = new BookingCancellationScenarioHelper();

  public validate = async (context: Context): Promise<ScenarioResult> => {
    const apiClient = context.getApiClient();
    const name = 'Booking Cancellation - Booking';
    const description = descriptions.bookingCancellationBooking;
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

    const resultConfirmation = await apiClient.bookingConfirmation(
      {
        uuid: resultReservation.data.uuid,
        contact: {
          firstName: 'John',
          lastName: 'Doe',
          emailAddress: 'johndoe@mail.com',
          fullName: 'John Doe',
          notes: 'Test note',
        },
        resellerReference: ReferenceHelper.generate(),
      },
      context,
    );

    if (resultConfirmation.data === null) {
      return this.helper.handleResult({
        result: resultConfirmation,
        name,
        description,
        errors: [new ValidatorError({ type: ErrorType.CRITICAL, message: 'Reservation Confirm Failed' })],
      });
    }
    const result = await apiClient.cancelBooking(
      {
        uuid: resultConfirmation.data.uuid,
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
      resultConfirmation.data,
      context,
    );
  };
}
