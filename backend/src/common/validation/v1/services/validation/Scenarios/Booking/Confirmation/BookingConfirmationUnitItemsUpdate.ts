import { Scenario, ScenarioResult } from '../../Scenario';
import { BookingConfirmationScenarioHelper } from '../../../helpers/BookingConfirmationScenarioHelper';
import descriptions from '../../../consts/descriptions';
import { ScenarioHelper } from '../../../helpers/ScenarioHelper';
import { Booker } from '../../../Booker';
import { ErrorType, ValidatorError } from '../../../../../validators/backendValidator/ValidatorHelpers';
import { Context } from '../../../context/Context';
import { ReferenceHelper } from '../../../../../helpers/ReferenceHelper';

export class BookingConfirmationUnitItemUpdateScenario implements Scenario {
  private readonly helper = new ScenarioHelper();
  private readonly booker = new Booker();
  private readonly bookingConfirmationScenarioHelper = new BookingConfirmationScenarioHelper();

  public validate = async (context: Context): Promise<ScenarioResult> => {
    const apiClient = context.getApiClient();
    const name = 'Booking Confirmation unitItems update';
    const description = descriptions.bookingConfirmationUnitItemsUpdate;
    const [bookableProduct] = context.productConfig.availableProducts;

    const resultReservation = await this.booker.createReservation(bookableProduct, context, { unitItemsQuantity: 2 });
    if (resultReservation.data === null) {
      return this.helper.handleResult({
        result: resultReservation,
        name,
        description,
        errors: [new ValidatorError({ type: ErrorType.CRITICAL, message: 'Reservation Creation Failed' })],
      });
    }
    const unitItems = bookableProduct.getValidUnitItems({ quantity: 3 });
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
        // TODO: make it dynamic
        resellerReference: ReferenceHelper.generate(),
        unitItems,
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
