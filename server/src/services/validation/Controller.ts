import { BookingListFlow } from "./Flows/Booking/BookingListFlow";
import { BookingGetFlow } from "./Flows/Booking/BookingGetFlow";
import { BookingCancellationFlow } from "./Flows/Booking/BookingCancellationFlow";
import { BookingUpdateFlow } from "./Flows/Booking/BookingUpdateFlow";
import { BookingConfirmationFlow } from "./Flows/Booking/BookingConfirmationFlow";
import { BookingExtendFlow } from "./Flows/Booking/BookingExtendFlow";
import { BookingReservationFlow } from "./Flows/Booking/BookingReservationFlow";
import { AvailabilityFlow } from "./Flows/Availability/AvailabilityFlow";
import { AvailabilityCalendarFlow } from "./Flows/Availability/AvailabilityCalendarFlow";
import { ProductFlow } from "./Flows/Product/ProductFlow";
import { SupplierFlow } from "./Flows/Supplier/SupplierFlow";
import { CapabilitiesFlow } from "./Flows/Capabilites/CapabilitiesFlow";
import { Flow, FlowResult } from "./Flows/Flow";
import { Context } from "./context/Context";

export class ValidationController {
  public validate = async (context: Context): Promise<FlowResult[]> => {
    const flows: Flow[] = [
      // new CapabilitiesFlow(),
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
