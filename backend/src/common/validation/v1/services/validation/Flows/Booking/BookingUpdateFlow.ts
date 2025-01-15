import { BookingUpdateContactScenario } from '../../Scenarios/Booking/Update/BookingUpdateContact';
import { BookingUpdateDateScenario } from '../../Scenarios/Booking/Update/BookingUpdateDate';
import { BookingUpdateProductScenario } from '../../Scenarios/Booking/Update/BookingUpdateProduct';
import { BookingUpdateUnitItemsScenario } from '../../Scenarios/Booking/Update/BookingUpdateUnitItems';
import { Scenario } from '../../Scenarios/Scenario';
import docs from '../../consts/docs';
import { Context } from '../../context/Context';
import { BaseFlow } from '../BaseFlow';
import { Flow, FlowResult } from '../Flow';

export class BookingUpdateFlow extends BaseFlow implements Flow {
  public constructor() {
    super('Booking Update', docs.bookingUpdate);
  }

  public validate = async (context: Context): Promise<FlowResult> => {
    const scenarios: Scenario[] = [
      new BookingUpdateDateScenario(),
      new BookingUpdateUnitItemsScenario(),
      new BookingUpdateContactScenario(),
    ];

    if (context.productConfig.isRebookAvailable) {
      scenarios.push(new BookingUpdateProductScenario());
    }

    return await this.validateScenarios(scenarios, context);
  };
}
