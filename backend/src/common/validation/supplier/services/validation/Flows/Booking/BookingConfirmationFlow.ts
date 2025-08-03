import docs from '../../consts/docs';
import { Context } from '../../context/Context';
import { BookingConfirmationScenario } from '../../Scenarios/Booking/Confirmation/BookingConfirmation';
import { BookingConfirmationInvalidUnitIdScenario } from '../../Scenarios/Booking/Confirmation/BookingConfirmationInvalidUnitId';
import { BookingConfirmationInvalidUUIDScenario } from '../../Scenarios/Booking/Confirmation/BookingConfirmationInvalidUUID';
import { BookingConfirmationUnitItemUpdateScenario } from '../../Scenarios/Booking/Confirmation/BookingConfirmationUnitItemsUpdate';
import { BaseFlow } from '../BaseFlow';
import { Flow, FlowResult } from '../Flow';

export class BookingConfirmationFlow extends BaseFlow implements Flow {
  public constructor() {
    super('Booking Confirmation', docs.bookingConfirmation);
  }

  public validate = async (context: Context): Promise<FlowResult> => {
    const scenarios = [
      new BookingConfirmationScenario(),
      new BookingConfirmationUnitItemUpdateScenario(),
      new BookingConfirmationInvalidUUIDScenario(),
      new BookingConfirmationInvalidUnitIdScenario(),
    ];

    return await this.validateScenarios(scenarios, context);
  };
}
