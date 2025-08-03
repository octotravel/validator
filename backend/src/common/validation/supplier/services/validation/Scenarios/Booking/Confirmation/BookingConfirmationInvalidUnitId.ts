import { ReferenceHelper } from '../../../../../helpers/ReferenceHelper';
import { InvalidUnitIdErrorValidator } from '../../../../../validators/backendValidator/Error/InvalidUnitIdErrorValidator';
import { ErrorType, ValidatorError } from '../../../../../validators/backendValidator/ValidatorHelpers';
import { Booker } from '../../../Booker';
import descriptions from '../../../consts/descriptions';
import { Context } from '../../../context/Context';
import { BookingConfirmationScenarioHelper } from '../../../helpers/BookingConfirmationScenarioHelper';
import { ScenarioHelper } from '../../../helpers/ScenarioHelper';
import { Scenario, ScenarioResult } from '../../Scenario';

export class BookingConfirmationInvalidUnitIdScenario implements Scenario {
  private readonly helper = new ScenarioHelper();
  private readonly booker = new Booker();

  private readonly bookingConfirmationScenarioHelper = new BookingConfirmationScenarioHelper();

  public validate = async (context: Context): Promise<ScenarioResult> => {
    const apiClient = context.getApiClient();
    const name = 'Booking Confirmation Invalid Unit ID (400 INVALID_UNIT_ID)';
    const description = descriptions.invalidUnitId;
    const [bookableProduct] = context.productConfig.availableProducts;

    const resultReservation = await this.booker.createReservation(bookableProduct, context, {
      unitItemsQuantity: 2,
    });
    if (resultReservation.data === null) {
      return this.helper.handleResult({
        result: resultReservation,
        name,
        description,
        errors: [new ValidatorError({ type: ErrorType.CRITICAL, message: 'Reservation Creation Failed' })],
      });
    }
    const unitItems = bookableProduct.getInvalidUnitItems({ quantity: 2 });

    const result = await apiClient.bookingConfirmation(
      {
        uuid: resultReservation.data.uuid,
        unitItems,
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

    return this.bookingConfirmationScenarioHelper.validateError(
      {
        result,
        name,
        description,
      },
      new InvalidUnitIdErrorValidator(),
    );
  };
}
