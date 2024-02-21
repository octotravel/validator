import { Booking } from '@octocloud/types';
import { Scenario, ScenarioResult } from '../../Scenario';
import { InvalidUnitIdErrorValidator } from '../../../../../validators/backendValidator/Error/InvalidUnitIdErrorValidator';
import { BookingReservationScenarioHelper } from '../../../helpers/BookingReservationScenarioHelper';
import { Result } from '../../../api/types';
import descriptions from '../../../consts/descriptions';

export class BookingReservationInvalidUnitIdScenario implements Scenario {
  private readonly result: Result<Booking>;
  public constructor({ result }: { result: Result<Booking> }) {
    this.result = result;
  }

  private readonly bookingReservationScenarioHelper = new BookingReservationScenarioHelper();

  public validate = async (): Promise<ScenarioResult> => {
    const name = 'Booking Reservation Invalid Unit ID (400 INVALID_UNIT_ID)';
    const description = descriptions.invalidUnitId;

    return this.bookingReservationScenarioHelper.validateError(
      {
        result: this.result,
        name,
        description,
      },
      new InvalidUnitIdErrorValidator(),
    );
  };
}
