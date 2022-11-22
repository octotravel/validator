import { Flow, FlowResult } from "../Flow";
import { AvailabilityCalendarIntervalScenario } from "../../Scenarios/AvailabilityCalendar/AvailabilityCalendarInterval";
import { AvailabilityCalendarInvalidProductScenario } from "../../Scenarios/AvailabilityCalendar/AvailabilityCalendarInvalidProduct";
import { AvailabilityCalendarInvalidOptionScenario } from "../../Scenarios/AvailabilityCalendar/AvailabilityCalendarInvalidOption";
import { AvailabilityCalendarBadRequestScenario } from "../../Scenarios/AvailabilityCalendar/AvailabilityCalendarBadRequest";
import { BaseFlow } from "../BaseFlow";
import docs from "../../consts/docs";
import { Scenario } from "../../Scenarios/Scenario";

export class AvailabilityCalendarFlow extends BaseFlow implements Flow {
  constructor() {
    super("Availability Calendar", docs.availabilityCalendar);
  }

  public validate = async (): Promise<FlowResult> => {
    const scenarios: Scenario[] = [
      ...this.checkCalendarAvaialbility(),
      new AvailabilityCalendarInvalidProductScenario(),
      new AvailabilityCalendarInvalidOptionScenario(),
      new AvailabilityCalendarBadRequestScenario(),
    ];
    return this.validateScenarios(scenarios);
  };

  private checkCalendarAvaialbility =
    (): AvailabilityCalendarIntervalScenario[] => {
      return this.config.productConfig.productsForAvailabilityCheck.map(
        (product) => new AvailabilityCalendarIntervalScenario(product)
      );
    };
}
