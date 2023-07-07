import { Flow, FlowResult } from "../Flow";
import { BookingReservationExtendScenario } from "../../Scenarios/Booking/Extend/BookingReservationExtend";
import { BookingReservationExtendInvalidUUIDScenario } from "../../Scenarios/Booking/Extend/BookingReservationExtendInvalidUUID";
import { BaseFlow } from "../BaseFlow";
import docs from "../../consts/docs";
import { Context } from "../../context/Context";

export class BookingExtendFlow extends BaseFlow implements Flow {
  constructor() {
    super("Extend Reservation", docs.bookingReservationExtend);
  }

  public validate = async (context: Context): Promise<FlowResult> => {
    const scenarios = [
      new BookingReservationExtendScenario(),
      new BookingReservationExtendInvalidUUIDScenario(),
    ];
    return this.validateScenarios(scenarios, context);
  };
}
