import { BookingConfirmationScenario } from "../../Scenarios/Booking/Confirmation/BookingConfirmation.ts";
import { Flow, FlowResult } from "../Flow.ts";
import { BookingConfirmationUnitItemUpdateScenario } from "../../Scenarios/Booking/Confirmation/BookingConfirmationUnitItemsUpdate.ts";
import { BookingConfirmationInvalidUUIDScenario } from "../../Scenarios/Booking/Confirmation/BookingConfirmationInvalidUUID.ts";
import { BookingConfirmationInvalidUnitIdScenario } from "../../Scenarios/Booking/Confirmation/BookingConfirmationInvalidUnitId.ts";
import { BaseFlow } from "../BaseFlow.ts";
import docs from "../../consts/docs.ts";

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
