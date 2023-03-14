import { BookingListFlow } from "./Flows/Booking/BookingListFlow.ts";
import { BookingGetFlow } from "./Flows/Booking/BookingGetFlow.ts";
import { BookingCancellationFlow } from "./Flows/Booking/BookingCancellationFlow.ts";
import { BookingUpdateFlow } from "./Flows/Booking/BookingUpdateFlow.ts";
import { BookingConfirmationFlow } from "./Flows/Booking/BookingConfirmationFlow.ts";
import { BookingExtendFlow } from "./Flows/Booking/BookingExtendFlow.ts";
import { BookingReservationFlow } from "./Flows/Booking/BookingReservationFlow.ts";
import { AvailabilityFlow } from "./Flows/Availability/AvailabilityFlow.ts";
import { AvailabilityCalendarFlow } from "./Flows/Availability/AvailabilityCalendarFlow.ts";
import { ProductFlow } from "./Flows/Product/ProductFlow.ts";
import { SupplierFlow } from "./Flows/Supplier/SupplierFlow.ts";
import { CapabilitiesFlow } from "./Flows/Capabilites/CapabilitiesFlow.ts";
import { Flow, FlowResult } from "./Flows/Flow.ts";
import { Context } from "./context/Context.ts";

export class ValidationController {
  public validate = async (context: Context): Promise<FlowResult[]> => {
    const flows: Flow[] = [
      new CapabilitiesFlow(),
      new SupplierFlow(),
      new ProductFlow(),
      new AvailabilityCalendarFlow(),
      new AvailabilityFlow(),
      new BookingReservationFlow(),
      new BookingExtendFlow(),
      new BookingConfirmationFlow(),
      new BookingUpdateFlow(),
      new BookingCancellationFlow(),
      new BookingGetFlow(),
      new BookingListFlow(),
    ];
    const results = [];

    for await (const flow of flows) {
      const result = await flow.validate(context);
      results.push(result);
      if (context.terminateValidation) {
        break;
      }
    }

    return results;
  };
}
