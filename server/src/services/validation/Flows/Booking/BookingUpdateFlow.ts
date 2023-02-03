import { Scenario } from "./../../Scenarios/Scenario.ts";
import { Flow, FlowResult } from "../Flow.ts";
import { BookingUpdateDateScenario } from "../../Scenarios/Booking/Update/BookingUpdateDate.ts";
import { BookingUpdateUnitItemsScenario } from "../../Scenarios/Booking/Update/BookingUpdateUnitItems.ts";
import { BookingUpdateContactScenario } from "../../Scenarios/Booking/Update/BookingUpdateContact.ts";
import { BookingUpdateProductScenario } from "../../Scenarios/Booking/Update/BookingUpdateProduct.ts";
import { BaseFlow } from "../BaseFlow.ts";
import docs from "../../consts/docs.ts";
import { Context } from "../../context/Context.ts";

export class BookingUpdateFlow extends BaseFlow implements Flow {
  constructor() {
    super("Booking Update", docs.bookingUpdate);
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

    return this.validateScenarios(scenarios, context);
  };
}
