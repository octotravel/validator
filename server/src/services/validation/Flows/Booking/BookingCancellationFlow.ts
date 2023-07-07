import { Flow, FlowResult } from "../Flow";
import { BookingCancellationReservationScenario } from "../../Scenarios/Booking/Cancellation/BookingCancellationReservation";
import { BookingCancellationBookingScenario } from "../../Scenarios/Booking/Cancellation/BookingCancellationBooking";
import { BookingCancellationInvalidUUIDScenario } from "../../Scenarios/Booking/Cancellation/BookingCancellationInvalidUUID";
import { BaseFlow } from "../BaseFlow";
import docs from "../../consts/docs";
import { Context } from "../../context/Context";

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
