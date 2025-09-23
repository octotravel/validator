import { InvalidBookingUUIDErrorValidator } from '../../../../../validators/backendValidator/Error/InvalidBookingUUIDErrorValidator';
import descriptions from '../../../consts/descriptions';
import { Context } from '../../../context/Context';
import { BookingConfirmationScenarioHelper } from '../../../helpers/BookingConfirmationScenarioHelper';
import { Scenario, ScenarioResult } from '../../Scenario';

export class BookingConfirmationInvalidUUIDScenario implements Scenario {
  private readonly bookingConfirmationScenarioHelper = new BookingConfirmationScenarioHelper();

  public validate = async (context: Context): Promise<ScenarioResult> => {
    const apiClient = context.getApiClient();

    const result = await apiClient.bookingConfirmation(
      {
        uuid: context.invalidUUID,
        contact: {},
      },
      context,
    );

    const name = 'Booking Confirmation Invalid Booking UUID (400 INVALID_BOOKING_UUID/BAD_REQUEST)';
    const description = descriptions.invalidUUID;

    return this.bookingConfirmationScenarioHelper.validateError(
      {
        result,
        name,
        description,
      },
      new InvalidBookingUUIDErrorValidator(),
    );
  };
}
