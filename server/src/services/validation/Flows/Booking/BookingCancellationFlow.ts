import { Flow, FlowResult } from "../Flow.ts";
import { BookingCancellationReservationScenario } from "../../Scenarios/Booking/Cancellation/BookingCancellationReservation.ts";
import { BookingCancellationBookingScenario } from "../../Scenarios/Booking/Cancellation/BookingCancellationBooking.ts";
import { BookingCancellationInvalidUUIDScenario } from "../../Scenarios/Booking/Cancellation/BookingCancellationInvalidUUID.ts";
import { BaseFlow } from "../BaseFlow.ts";
import docs from "../../consts/docs.ts";
import { Context } from "../../context/Context.ts";

export class BookingCancellationFlow extends BaseFlow implements Flow {
  constructor() {
    super("Booking Cancellation", docs.bookingCancellation);
  }

  public validate = async (context: Context): Promise<FlowResult> => {
    const scenarios = [
      new BookingCancellationReservationScenario(),
      new BookingCancellationBookingScenario(),
      new BookingCancellationInvalidUUIDScenario(),
    ];

    return this.validateScenarios(scenarios, context);
  };
}
