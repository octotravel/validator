import { Scenario, ScenarioResult } from '../../Scenario';
import { BookingListScenarioHelper } from '../../../helpers/BookingListScenarioHelper';
import descriptions from '../../../consts/descriptions';
import { ScenarioHelper } from '../../../helpers/ScenarioHelper';
import { Booker } from '../../../Booker';
import { ErrorType, ValidatorError } from '../../../../../validators/backendValidator/ValidatorHelpers';
import { Context } from '../../../context/Context';

export class BookingListSupplierReferenceScenario implements Scenario {
  private readonly helper = new ScenarioHelper();
  private readonly booker = new Booker();
  private readonly bookingListScenarionHelper = new BookingListScenarioHelper();

  public validate = async (context: Context): Promise<ScenarioResult> => {
    const apiClient = context.getApiClient();
    const name = 'List Bookings - Supplier Reference';
    const description = descriptions.bookingListSupplierReference;
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
          fullName: 'John Doe',
        },
        resellerReference: 'RESELLERREF#1',
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

    const result = await apiClient.getBookings(
      {
        supplierReference: resultConfirmation.data.supplierReference as string,
      },
      context,
    );

    return this.bookingListScenarionHelper.validateBookingList(
      {
        result,
        name,
        description,
      },
      context,
    );
  };
}
