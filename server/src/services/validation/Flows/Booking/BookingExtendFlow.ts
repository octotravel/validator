import { Flow, FlowResult } from "../Flow.ts";
import { BookingReservationExtendScenario } from "../../Scenarios/Booking/Extend/BookingReservationExtend.ts";
import { BookingReservationExtendInvalidUUIDScenario } from "../../Scenarios/Booking/Extend/BookingReservationExtendInvalidUUID.ts";
import { BaseFlow } from "../BaseFlow.ts";
import docs from "../../consts/docs.ts";

export class BookingExtendFlow extends BaseFlow implements Flow {
  constructor() {
    super("Extend Reservation", docs.bookingReservationExtend);
  }

  public validate = async (): Promise<FlowResult> => {
    const scenarios = [
      new BookingReservationExtendScenario(),
      new BookingReservationExtendInvalidUUIDScenario(),
    ];
    return this.validateScenarios(scenarios);
  };
}
