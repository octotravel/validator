import docs from '../../consts/docs';
import { Context } from '../../context/Context';
import { AvailabilityCalendarBadRequestScenario } from '../../Scenarios/AvailabilityCalendar/AvailabilityCalendarBadRequest';
import { AvailabilityCalendarIntervalScenario } from '../../Scenarios/AvailabilityCalendar/AvailabilityCalendarInterval';
import { AvailabilityCalendarInvalidOptionScenario } from '../../Scenarios/AvailabilityCalendar/AvailabilityCalendarInvalidOption';
import { AvailabilityCalendarInvalidProductScenario } from '../../Scenarios/AvailabilityCalendar/AvailabilityCalendarInvalidProduct';
import { Scenario } from '../../Scenarios/Scenario';
import { BaseFlow } from '../BaseFlow';
import { Flow, FlowResult } from '../Flow';

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
      (product) => new AvailabilityCalendarIntervalScenario(product),
    );
  };
}
