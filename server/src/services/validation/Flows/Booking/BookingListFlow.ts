import { Flow, FlowResult } from "../Flow.ts";
import { BookingListSupplierReferenceScenario } from "../../Scenarios/Booking/List/BookingListSupplierReference.ts";
import { BookingListResellerReferenceScenario } from "../../Scenarios/Booking/List/BookingListResellerReference.ts";
import { BookingListBadRequestScenario } from "../../Scenarios/Booking/List/BookingListBadRequest.ts";
import { BaseFlow } from "../BaseFlow.ts";
import docs from "../../consts/docs.ts";
import { Context } from "../../context/Context.ts";

export class BookingListFlow extends BaseFlow implements Flow {
  constructor() {
    super("List Bookings", docs.bookingList);
  }

  public validate = async (context: Context): Promise<FlowResult> => {
    const scenarios = [
      new BookingListSupplierReferenceScenario(),
      new BookingListResellerReferenceScenario(),
      new BookingListBadRequestScenario(),
    ];
    return this.validateScenarios(scenarios, context);
  };
}
