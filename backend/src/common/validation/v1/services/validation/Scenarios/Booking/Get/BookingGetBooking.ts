import { BookingContactSchema } from '@octocloud/types';
import { Scenario, ScenarioResult } from '../../Scenario';
import { BookingGetScenarioHelper } from '../../../helpers/BookingGetScenarioHelper';
import descriptions from '../../../consts/descriptions';
import { Booker } from '../../../Booker';
import { ErrorType, ValidatorError } from '../../../../../validators/backendValidator/ValidatorHelpers';
import { ScenarioHelper } from '../../../helpers/ScenarioHelper';
import { Context } from '../../../context/Context';
import { ReferenceHelper } from '../../../../../helpers/ReferenceHelper';

export class BookingGetBookingScenario implements Scenario {
  private readonly helper = new ScenarioHelper();
  private readonly booker = new Booker();

  private readonly bookingGetScenarionHelper = new BookingGetScenarioHelper();

  public validate = async (context: Context): Promise<ScenarioResult> => {
    const apiClient = context.getApiClient();
    const name = 'Get Booking - Booking';
    const description = descriptions.bookingGetBooking;
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

    const result = await apiClient.getBooking(
      {
        uuid: resultConfirmation.data.uuid,
      },
      context,
    );

    return this.bookingGetScenarionHelper.validateBookingGet(
      {
        result,
        name,
        description,
      },
      context,
    );
  };
}
