import { Flow, FlowResult } from "../Flow.ts";
import { AvailabilityCalendarIntervalScenario } from "../../Scenarios/AvailabilityCalendar/AvailabilityCalendarInterval.ts";
import { AvailabilityCalendarInvalidProductScenario } from "../../Scenarios/AvailabilityCalendar/AvailabilityCalendarInvalidProduct.ts";
import { AvailabilityCalendarInvalidOptionScenario } from "../../Scenarios/AvailabilityCalendar/AvailabilityCalendarInvalidOption.ts";
import { AvailabilityCalendarBadRequestScenario } from "../../Scenarios/AvailabilityCalendar/AvailabilityCalendarBadRequest.ts";
import { BaseFlow } from "../BaseFlow.ts";
import docs from "../../consts/docs.ts";
import { Scenario } from "../../Scenarios/Scenario.ts";
import { Context } from "../../context/Context.ts";

export class AvailabilityCalendarFlow extends BaseFlow implements Flow {
  constructor() {
    super("Availability Calendar", docs.availabilityCalendar);
  }

  public validate = async (context: Context): Promise<FlowResult> => {
    const scenarios: Scenario[] = [
      ...this.checkCalendarAvaialbility(context),
      new AvailabilityCalendarInvalidProductScenario(),
      new AvailabilityCalendarInvalidOptionScenario(),
      new AvailabilityCalendarBadRequestScenario(),
    ];
    return this.validateScenarios(scenarios, context);
  };

  private checkCalendarAvaialbility =
    (context: Context): AvailabilityCalendarIntervalScenario[] => {
      return context.productConfig.productsForAvailabilityCheck.map(
        (product: any) => new AvailabilityCalendarIntervalScenario(product)
      );
    };
}
