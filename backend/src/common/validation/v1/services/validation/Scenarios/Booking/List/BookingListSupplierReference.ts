import * as R from 'ramda';
import { ReferenceHelper } from '../../../../../helpers/ReferenceHelper';
import { ErrorType, ValidatorError } from '../../../../../validators/backendValidator/ValidatorHelpers';
import { Booker } from '../../../Booker';
import descriptions from '../../../consts/descriptions';
import { Context } from '../../../context/Context';
import { BookingListScenarioHelper } from '../../../helpers/BookingListScenarioHelper';
import { ScenarioHelper } from '../../../helpers/ScenarioHelper';
import { Scenario, ScenarioResult } from '../../Scenario';

export class BookingListSupplierReferenceScenario implements Scenario {
  private readonly helper = new ScenarioHelper();
  private readonly booker = new Booker();
  private readonly bookingListScenarionHelper = new BookingListScenarioHelper();

  public validate = async (context: Context): Promise<ScenarioResult> => {
    const apiClient = context.getApiClient();
    const name = 'List Bookings - Supplier Reference (Optional)';
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

    const resellerReference = ReferenceHelper.generate();
    const resultConfirmation = await apiClient.bookingConfirmation(
      {
        uuid: resultReservation.data.uuid,
        contact: {
          fullName: 'John Doe',
        },
        resellerReference: resellerReference,
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

    const supplierReference =
      resultReservation.data.supplierReference ?? resultConfirmation.data.supplierReference ?? undefined;
    const result = await apiClient.getBookings(
      {
        supplierReference: supplierReference,
        resellerReference: R.isNil(supplierReference) ? resellerReference : undefined,
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
