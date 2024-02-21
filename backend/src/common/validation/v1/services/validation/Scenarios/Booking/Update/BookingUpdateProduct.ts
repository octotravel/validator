import { Scenario, ScenarioResult } from '../../Scenario';
import { BookingUpdateScenarioHelper } from '../../../helpers/BookingUpdateScenarioHelper';
import descriptions from '../../../consts/descriptions';
import { ScenarioHelper } from '../../../helpers/ScenarioHelper';
import { Booker } from '../../../Booker';
import { ErrorType, ValidatorError } from '../../../../../validators/backendValidator/ValidatorHelpers';
import { Context } from '../../../context/Context';

export class BookingUpdateProductScenario implements Scenario {
  private readonly helper = new ScenarioHelper();
  private readonly booker = new Booker();
  private readonly bookingUpdateScenarioHelper = new BookingUpdateScenarioHelper();

  public validate = async (context: Context): Promise<ScenarioResult> => {
    const apiClient = context.getApiClient();
    const name = 'Booking Update - Change Product';
    const description = descriptions.bookingUpdateProduct;
    const [bookableProduct1, bookableProduct2] = context.productConfig.availableProducts;

    const resultReservation = await this.booker.createReservation(bookableProduct1, context);

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
        productId: bookableProduct2.product.id,
        optionId: bookableProduct2.getOption().id,
        unitItems: bookableProduct2.getValidUnitItems(),
        availabilityId: bookableProduct2.randomAvailabilityID,
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
