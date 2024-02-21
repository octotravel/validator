import { Scenario, ScenarioResult } from '../../Scenario';
import { InvalidBookingUUIDErrorValidator } from '../../../../../validators/backendValidator/Error/InvalidBookingUUIDErrorValidator';
import { BookingGetScenarioHelper } from '../../../helpers/BookingGetScenarioHelper';
import descriptions from '../../../consts/descriptions';
import { Context } from '../../../context/Context';

export class BookingGetInvalidUUIDScenario implements Scenario {
  private readonly bookingGetScenarioHelper = new BookingGetScenarioHelper();

  public validate = async (context: Context): Promise<ScenarioResult> => {
    const apiClient = context.getApiClient();

    const result = await apiClient.getBooking(
      {
        uuid: context.invalidUUID,
      },
      context,
    );

    const name = 'Get Booking Invalid Booking UUID (400 INVALID_BOOKING_UUID)';
    const description = descriptions.invalidUUID;

    return this.bookingGetScenarioHelper.validateError(
      {
        result,
        name,
        description,
      },
      new InvalidBookingUUIDErrorValidator(),
    );
  };
}
