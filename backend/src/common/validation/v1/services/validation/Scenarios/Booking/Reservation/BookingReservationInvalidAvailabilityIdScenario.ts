import { InvalidAvailabilityIdErrorValidator } from './../../../../../validators/backendValidator/Error/InvalidAvailabilityIdErrorValidator';
import { Scenario, ScenarioResult } from '../../Scenario';
import { BookingReservationScenarioHelper } from '../../../helpers/BookingReservationScenarioHelper';
import { Booking } from '@octocloud/types';
import { Result } from '../../../api/types';
import descriptions from '../../../consts/descriptions';

export class BookingReservationInvalidAvailabilityIdScenario implements Scenario {
  private readonly result: Result<Booking>;
  public constructor({ result }: { result: Result<Booking> }) {
    this.result = result;
  }

  private readonly bookingReservationScenarioHelper = new BookingReservationScenarioHelper();

  public validate = async (): Promise<ScenarioResult> => {
    const name = 'Booking Reservation Invalid Availability ID (400 INVALID_AVAILABILITY_ID)';
    const description = descriptions.bookingReservationInvalidAvailabilityId;

    return this.bookingReservationScenarioHelper.validateError(
      {
        result: this.result,
        name,
        description,
      },
      new InvalidAvailabilityIdErrorValidator(),
    );
  };
}
