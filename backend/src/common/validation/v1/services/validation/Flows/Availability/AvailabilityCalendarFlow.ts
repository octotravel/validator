import { Flow, FlowResult } from '../Flow';
import { AvailabilityCalendarIntervalScenario } from '../../Scenarios/AvailabilityCalendar/AvailabilityCalendarInterval';
import { AvailabilityCalendarInvalidProductScenario } from '../../Scenarios/AvailabilityCalendar/AvailabilityCalendarInvalidProduct';
import { AvailabilityCalendarInvalidOptionScenario } from '../../Scenarios/AvailabilityCalendar/AvailabilityCalendarInvalidOption';
import { AvailabilityCalendarBadRequestScenario } from '../../Scenarios/AvailabilityCalendar/AvailabilityCalendarBadRequest';
import { BaseFlow } from '../BaseFlow';
import docs from '../../consts/docs';
import { Scenario } from '../../Scenarios/Scenario';
import { Context } from '../../context/Context';

export class AvailabilityCalendarFlow extends BaseFlow implements Flow {
  public constructor() {
    super('Availability Calendar', docs.availabilityCalendar);
  }

  public validate = async (context: Context): Promise<FlowResult> => {
    const scenarios: Scenario[] = [
      ...this.checkCalendarAvaialbility(context),
      new AvailabilityCalendarInvalidProductScenario(),
      new AvailabilityCalendarInvalidOptionScenario(),
      new AvailabilityCalendarBadRequestScenario(),
    ];
    return await this.validateScenarios(scenarios, context);
  };

  private readonly checkCalendarAvaialbility = (context: Context): AvailabilityCalendarIntervalScenario[] => {
    return context.productConfig.productsForAvailabilityCheck.map(
      (product: any) => new AvailabilityCalendarIntervalScenario(product),
    );
  };
}
