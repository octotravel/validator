import { Scenario } from "./../../Scenarios/Scenario";
import { Flow, FlowResult } from "../Flow";
import { BookingUpdateDateScenario } from "../../Scenarios/Booking/Update/BookingUpdateDate";
import { BookingUpdateUnitItemsScenario } from "../../Scenarios/Booking/Update/BookingUpdateUnitItems";
import { BookingUpdateContactScenario } from "../../Scenarios/Booking/Update/BookingUpdateContact";
import { BookingUpdateProductScenario } from "../../Scenarios/Booking/Update/BookingUpdateProduct";
import { BaseFlow } from "../BaseFlow";
import docs from "../../consts/docs";
import { Context } from "../../context/Context";

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
