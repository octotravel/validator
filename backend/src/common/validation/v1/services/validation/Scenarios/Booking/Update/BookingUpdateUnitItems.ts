import { ErrorType, ValidatorError } from '../../../../../validators/backendValidator/ValidatorHelpers';
import { Booker } from '../../../Booker';
import descriptions from '../../../consts/descriptions';
import { Context } from '../../../context/Context';
import { BookingUpdateScenarioHelper } from '../../../helpers/BookingUpdateScenarioHelper';
import { ScenarioHelper } from '../../../helpers/ScenarioHelper';
import { Scenario, ScenarioResult } from '../../Scenario';

export class BookingUpdateUnitItemsScenario implements Scenario {
  private readonly helper = new ScenarioHelper();
  private readonly booker = new Booker();
  private readonly bookingUpdateScenarioHelper = new BookingUpdateScenarioHelper();

  public validate = async (context: Context): Promise<ScenarioResult> => {
    const apiClient = context.getApiClient();
    const name = 'Booking Update - Unit Items';
    const description = descriptions.bookingUpdateUnitItems;
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
    const unitItems = bookableProduct.getValidUnitItems({ quantity: 3 });
    const result = await apiClient.bookingUpdate(
      {
        uuid: resultReservation.data.uuid,
        unitItems,
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
