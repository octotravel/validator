import { Scenario, ScenarioResult } from '../../Scenario';
import { BookingListScenarioHelper } from '../../../helpers/BookingListScenarioHelper';
import { BadRequestErrorValidator } from '../../../../../validators/backendValidator/Error/BadRequestErrorValidator';
import descriptions from '../../../consts/descriptions';
import { Context } from '../../../context/Context';

export class BookingListBadRequestScenario implements Scenario {
  private readonly bookingListScenarioHelper = new BookingListScenarioHelper();

  public validate = async (context: Context): Promise<ScenarioResult> => {
    const apiClient = context.getApiClient();

    const result = await apiClient.getBookings({}, context);

    const name = 'List Bookings BAD_REQUEST (400 BAD_REQUEST)';
    const description = descriptions.bookingListBadRequest;

    return this.bookingListScenarioHelper.validateError(
      {
        result,
        name,
        description,
      },
      new BadRequestErrorValidator(),
    );
  };
}
