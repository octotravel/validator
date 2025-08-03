import { Booking } from '@octocloud/types';
import { UnprocessableEntityErrorValidator } from '../../../../../validators/backendValidator/Error/UnprocessableEntityErrorValidator';
import { Result } from '../../../api/types';
import descriptions from '../../../consts/descriptions';
import { BookingReservationScenarioHelper } from '../../../helpers/BookingReservationScenarioHelper';
import { Scenario, ScenarioResult } from '../../Scenario';

export class BookingReservationEmptyUnitItemsScenario implements Scenario {
  private readonly result: Result<Booking>;
  public constructor({ result }: { result: Result<Booking> }) {
    this.result = result;
  }

  private readonly bookingReservationScenarioHelper = new BookingReservationScenarioHelper();

  public validate = async (): Promise<ScenarioResult> => {
    const name = 'Booking Reservation Missing UnitItems (400 UNPROCESSABLE_ENTITY)';
    const description = descriptions.bookingReservationEmptyUnitItems;

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
