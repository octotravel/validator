import { Flow, FlowResult } from "../Flow.ts";
import { BookingGetReservationScenario } from "../../Scenarios/Booking/Get/BookingGetReservation.ts";
import { BookingGetBookingScenario } from "../../Scenarios/Booking/Get/BookingGetBooking.ts";
import { BookingGetInvalidUUIDScenario } from "../../Scenarios/Booking/Get/BookingGetInvalidUUID.ts";
import { BaseFlow } from "../BaseFlow.ts";
import docs from "../../consts/docs.ts";

export class BookingGetFlow extends BaseFlow implements Flow {
  constructor() {
    super("Get Booking", docs.bookingGet);
  }
  public validate = async (): Promise<FlowResult> => {
    const scenarios = [
      new BookingGetReservationScenario(),
      new BookingGetBookingScenario(),
      new BookingGetInvalidUUIDScenario(),
    ];
    return this.validateScenarios(scenarios);
  };
}
