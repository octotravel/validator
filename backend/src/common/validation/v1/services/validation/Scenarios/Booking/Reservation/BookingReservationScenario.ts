import { Result } from '../../../api/types';
import { Booking } from '@octocloud/types';
import { Scenario, ScenarioResult } from '../../Scenario';
import { BookingReservationScenarioHelper } from '../../../helpers/BookingReservationScenarioHelper';
import descriptions from '../../../consts/descriptions';
import { Context } from '../../../context/Context';

export class BookingReservationScenario implements Scenario {
  private readonly result: Result<Booking>;
  public constructor({ result }: { result: Result<Booking> }) {
    this.result = result;
  }

  private readonly bookingReservationScenarioHelper = new BookingReservationScenarioHelper();
  public validate = async (context: Context): Promise<ScenarioResult> => {
    const name = 'Booking Reservation';
    const description = descriptions.bookingReservation;

    return this.bookingReservationScenarioHelper.validateBookingReservation(
      {
        result: this.result,
        name,
        description,
      },
      context,
    );
  };
}
