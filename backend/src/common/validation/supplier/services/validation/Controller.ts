import { Context } from './context/Context';
import { AvailabilityCalendarFlow } from './Flows/Availability/AvailabilityCalendarFlow';
import { AvailabilityFlow } from './Flows/Availability/AvailabilityFlow';
import { BookingCancellationFlow } from './Flows/Booking/BookingCancellationFlow';
import { BookingConfirmationFlow } from './Flows/Booking/BookingConfirmationFlow';
import { BookingExtendFlow } from './Flows/Booking/BookingExtendFlow';
import { BookingGetFlow } from './Flows/Booking/BookingGetFlow';
import { BookingListFlow } from './Flows/Booking/BookingListFlow';
import { BookingReservationFlow } from './Flows/Booking/BookingReservationFlow';
import { BookingUpdateFlow } from './Flows/Booking/BookingUpdateFlow';
import { Flow, FlowResult } from './Flows/Flow';
import { ProductFlow } from './Flows/Product/ProductFlow';
import { ProductsFlow } from './Flows/Products/ProductsFlow';
import { SupplierFlow } from './Flows/Supplier/SupplierFlow';

export class ValidationController {
  public validate = async (context: Context): Promise<FlowResult[]> => {
    const flows: Flow[] = [
      // new CapabilitiesFlow(),
      new SupplierFlow(),
      new ProductsFlow(),
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
    const flowResults = [];

    for await (const flow of flows) {
      const flowResult = await flow.validate(context);
      flowResults.push(flowResult);

      if (context.terminateValidation) {
        break;
      }
    }

    return flowResults;
  };
}
