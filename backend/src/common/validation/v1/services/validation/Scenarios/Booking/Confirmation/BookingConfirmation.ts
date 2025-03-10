import { ReferenceHelper } from '../../../../../helpers/ReferenceHelper';
import { ErrorType, ValidatorError } from '../../../../../validators/backendValidator/ValidatorHelpers';
import { Booker } from '../../../Booker';
import descriptions from '../../../consts/descriptions';
import { Context } from '../../../context/Context';
import { BookingConfirmationScenarioHelper } from '../../../helpers/BookingConfirmationScenarioHelper';
import { ScenarioHelper } from '../../../helpers/ScenarioHelper';
import { Scenario, ScenarioResult } from '../../Scenario';

export class BookingConfirmationScenario implements Scenario {
  private readonly helper = new ScenarioHelper();
  private readonly booker = new Booker();
  private readonly bookingConfirmationScenarioHelper = new BookingConfirmationScenarioHelper();

  public validate = async (context: Context): Promise<ScenarioResult> => {
    const apiClient = context.getApiClient();
    const name = 'Booking Confirmation';
    const description = descriptions.bookingConfirmation;
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

    const result = await apiClient.bookingConfirmation(
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

    return this.bookingConfirmationScenarioHelper.validateBookingConfirmation(
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
