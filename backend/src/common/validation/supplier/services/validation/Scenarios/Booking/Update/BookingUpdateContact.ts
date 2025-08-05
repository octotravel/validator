import { ErrorType, ValidatorError } from '../../../../../validators/backendValidator/ValidatorHelpers';
import { Booker } from '../../../Booker';
import descriptions from '../../../consts/descriptions';
import { Context } from '../../../context/Context';
import { BookingUpdateScenarioHelper } from '../../../helpers/BookingUpdateScenarioHelper';
import { ScenarioHelper } from '../../../helpers/ScenarioHelper';
import { Scenario, ScenarioResult } from '../../Scenario';

export class BookingUpdateContactScenario implements Scenario {
  private readonly helper = new ScenarioHelper();
  private readonly booker = new Booker();
  private readonly bookingUpdateScenarioHelper = new BookingUpdateScenarioHelper();

  public validate = async (context: Context): Promise<ScenarioResult> => {
    const apiClient = context.getApiClient();
    const name = 'Booking Update - Contact';
    const description = descriptions.bookingUpdateContact;
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

    const result = await apiClient.bookingUpdate(
      {
        uuid: resultReservation.data.uuid,
        contact: {
          fullName: 'John Doe',
          firstName: 'John',
          lastName: 'Doe',
          emailAddress: 'johndoe@email.com',
          phoneNumber: '+00000000',
          country: 'GB',
          notes: 'Test notes contact',
          locales: ['en'],
        },
        notes: 'Test note',
      },
      context,
    );

    return this.bookingUpdateScenarioHelper.validateBookingUpdate(
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
