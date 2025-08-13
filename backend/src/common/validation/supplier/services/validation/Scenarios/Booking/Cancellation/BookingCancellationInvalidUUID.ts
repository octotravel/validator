import { InvalidBookingUUIDErrorValidator } from '../../../../../validators/backendValidator/Error/InvalidBookingUUIDErrorValidator';
import descriptions from '../../../consts/descriptions';
import { Context } from '../../../context/Context';
import { BookingCancellationScenarioHelper } from '../../../helpers/BookingCancellationScenarioHelper';
import { Scenario, ScenarioResult } from '../../Scenario';

export class BookingCancellationInvalidUUIDScenario implements Scenario {
  private readonly bookingCancellationScenarioHelper = new BookingCancellationScenarioHelper();

  public validate = async (context: Context): Promise<ScenarioResult> => {
    const apiClient = context.getApiClient();

    const result = await apiClient.cancelBooking(
      {
        uuid: context.invalidUUID,
      },
      context,
    );

    const name = 'Booking Cancellation Invalid Booking UUID (400 INVALID_BOOKING_UUID)';
    const description = descriptions.invalidUUID;

    return this.bookingCancellationScenarioHelper.validateError(
      {
        result,
        name,
        description,
      },
      new InvalidBookingUUIDErrorValidator(),
    );
  };
}
