import { BookingReservationExtendScenario } from '../../Scenarios/Booking/Extend/BookingReservationExtend';
import { BookingReservationExtendInvalidUUIDScenario } from '../../Scenarios/Booking/Extend/BookingReservationExtendInvalidUUID';
import docs from '../../consts/docs';
import { Context } from '../../context/Context';
import { BaseFlow } from '../BaseFlow';
import { Flow, FlowResult } from '../Flow';

export class BookingExtendFlow extends BaseFlow implements Flow {
  public constructor() {
    super('Extend Reservation', docs.bookingReservationExtend);
  }

  public validate = async (context: Context): Promise<FlowResult> => {
    const scenarios = [new BookingReservationExtendScenario(), new BookingReservationExtendInvalidUUIDScenario()];
    return await this.validateScenarios(scenarios, context);
  };
}
