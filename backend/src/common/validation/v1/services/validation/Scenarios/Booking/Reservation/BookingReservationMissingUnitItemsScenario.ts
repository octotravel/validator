import { Booking } from '@octocloud/types';
import { Scenario, ScenarioResult } from '../../Scenario';
import { UnprocessableEntityErrorValidator } from '../../../../../validators/backendValidator/Error/UnprocessableEntityErrorValidator';
import { BookingReservationScenarioHelper } from '../../../helpers/BookingReservationScenarioHelper';
import { Result } from '../../../api/types';
import descriptions from '../../../consts/descriptions';

export class BookingReservationMissingUnitItemsScenario implements Scenario {
  private readonly result: Result<Booking>;
  public constructor({ result }: { result: Result<Booking> }) {
    this.result = result;
  }

  private readonly bookingReservationScenarioHelper = new BookingReservationScenarioHelper();

  public validate = async (): Promise<ScenarioResult> => {
    const name = 'Booking Reservation Missing UnitItems (400 UNPROCESSABLE_ENTITY)';
    const description = descriptions.bookingReservationMissingUnitItems;

    return this.bookingReservationScenarioHelper.validateError(
      {
        result: this.result,
        name,
        description,
      },
      new UnprocessableEntityErrorValidator(),
    );
  };
}
