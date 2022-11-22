import { BookingConfirmationScenario } from "../../Scenarios/Booking/Confirmation/BookingConfirmation";
import { Flow, FlowResult } from "../Flow";
import { BookingConfirmationUnitItemUpdateScenario } from "../../Scenarios/Booking/Confirmation/BookingConfirmationUnitItemsUpdate";
import { BookingConfirmationInvalidUUIDScenario } from "../../Scenarios/Booking/Confirmation/BookingConfirmationInvalidUUID";
import { BookingConfirmationInvalidUnitIdScenario } from "../../Scenarios/Booking/Confirmation/BookingConfirmationInvalidUnitId";
import { BaseFlow } from "../BaseFlow";
import docs from "../../consts/docs";

export class BookingConfirmationFlow extends BaseFlow implements Flow {
  constructor() {
    super("Booking Confirmation", docs.bookingConfirmation);
  }

  public validate = async (): Promise<FlowResult> => {
    const scenarios = [
      new BookingConfirmationScenario(),
      new BookingConfirmationUnitItemUpdateScenario(),
      new BookingConfirmationInvalidUUIDScenario(),
      new BookingConfirmationInvalidUnitIdScenario(),
    ];

    return this.validateScenarios(scenarios);
  };
}
