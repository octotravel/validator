import { inject } from '@needle-di/core';
import { SupplierRequestLogService } from '../../../../requestLog/supplier/SupplierRequestLogService';
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
import { SupplierFlow } from './Flows/Supplier/SupplierFlow';
import { Context } from './context/Context';

export class ValidationController {
  public constructor(private readonly supplierRequestLogService = inject(SupplierRequestLogService)) {}

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

      for (const scenario of result.scenarios) {
        this.supplierRequestLogService.logScenario(scenario, context);
      }

      if (context.terminateValidation) {
        break;
      }
    }

    return results;
  };
}
