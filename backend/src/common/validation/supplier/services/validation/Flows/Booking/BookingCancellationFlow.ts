import docs from '../../consts/docs';
import { Context } from '../../context/Context';
import { BookingCancellationBookingScenario } from '../../Scenarios/Booking/Cancellation/BookingCancellationBooking';
import { BookingCancellationInvalidUUIDScenario } from '../../Scenarios/Booking/Cancellation/BookingCancellationInvalidUUID';
import { BookingCancellationReservationScenario } from '../../Scenarios/Booking/Cancellation/BookingCancellationReservation';
import { BaseFlow } from '../BaseFlow';

import { Flow, FlowResult } from '../Flow';

export class BookingCancellationFlow extends BaseFlow implements Flow {
  public constructor() {
    super('Booking Cancellation', docs.bookingCancellation);
  }

  public validate = async (context: Context): Promise<FlowResult> => {
    const scenarios = [
      new BookingCancellationReservationScenario(),
      new BookingCancellationBookingScenario(),
      new BookingCancellationInvalidUUIDScenario(),
    ];

    return await this.validateScenarios(scenarios, context);
  };
}
