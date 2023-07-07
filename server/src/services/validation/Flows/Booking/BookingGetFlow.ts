import { Flow, FlowResult } from "../Flow";
import { BookingGetReservationScenario } from "../../Scenarios/Booking/Get/BookingGetReservation";
import { BookingGetBookingScenario } from "../../Scenarios/Booking/Get/BookingGetBooking";
import { BookingGetInvalidUUIDScenario } from "../../Scenarios/Booking/Get/BookingGetInvalidUUID";
import { BaseFlow } from "../BaseFlow";
import docs from "../../consts/docs";
import { Context } from "../../context/Context";

export class BookingGetFlow extends BaseFlow implements Flow {
  constructor() {
    super("Get Booking", docs.bookingGet);
  }
  public validate = async (context: Context): Promise<FlowResult> => {
    const scenarios = [
      new BookingGetReservationScenario(),
      new BookingGetBookingScenario(),
      new BookingGetInvalidUUIDScenario(),
    ];
    return this.validateScenarios(scenarios, context);
  };
}
