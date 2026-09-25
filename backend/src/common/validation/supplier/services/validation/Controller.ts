import { inject } from '@needle-di/core';
import { SupplierRequestLogService } from '../../../../requestLog/supplier/SupplierRequestLogService';
import { ErrorType, ValidatorError } from '../../validators/backendValidator/ValidatorHelpers';
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
import { ScenarioResult, ValidationResult } from './Scenarios/Scenario';

export class ValidationController {
  public constructor(private readonly supplierRequestLogService = inject(SupplierRequestLogService)) {}

  public validate = async (context: Context): Promise<FlowResult[]> => {
    const setupFlows: Flow[] = [
      // new CapabilitiesFlow(),
      new SupplierFlow(),
      new ProductFlow(),
      new AvailabilityCalendarFlow(),
      new AvailabilityFlow(),
    ];
    const bookingFlows: Flow[] = [
      new BookingReservationFlow(),
      new BookingExtendFlow(),
      new BookingConfirmationFlow(),
      new BookingUpdateFlow(),
      new BookingCancellationFlow(),
      new BookingGetFlow(),
      new BookingListFlow(),
    ];
    const results: FlowResult[] = [];

    const runFlow = async (flow: Flow): Promise<void> => {
      const result = await flow.validate(context);
      results.push(result);
      for (const scenario of result.scenarios) {
        await this.supplierRequestLogService.logScenario(scenario, context);
      }
    };

    for (const flow of setupFlows) {
      await runFlow(flow);
      if (context.terminateValidation) {
        return results;
      }
    }

    // Before running the booking lifecycle, make sure the supplier exposes enough availability to
    // satisfy every reservation the booking flows will make (see
    // docs/reservation-availability-refactor.md). Otherwise the run would exhaust capacity midway
    // and report misleading per-scenario failures.
    const capacityResult = this.checkAvailabilityCapacity(context, bookingFlows);
    if (capacityResult !== null) {
      results.push(capacityResult);
      for (const scenario of capacityResult.scenarios) {
        await this.supplierRequestLogService.logScenario(scenario, context);
      }
      if (context.terminateValidation) {
        return results;
      }
    }

    for (const flow of bookingFlows) {
      await runFlow(flow);
      if (context.terminateValidation) {
        break;
      }
    }

    return results;
  };

  private readonly checkAvailabilityCapacity = (context: Context, bookingFlows: Flow[]): FlowResult | null => {
    const [bookableProduct] = context.productConfig.availableProducts;
    if (bookableProduct === undefined) {
      return null;
    }

    const requiredReservations = bookingFlows.reduce(
      (total, flow) => total + flow.getReservationDemand(context).reservations,
      0,
    );
    if (requiredReservations === 0) {
      return null;
    }

    const requiredUnits = requiredReservations * bookableProduct.maxUnitsPerReservation;
    const availableUnits = bookableProduct.totalVacancy;
    if (availableUnits >= requiredUnits) {
      return null;
    }

    context.terminateValidation = true;
    const error = new ValidatorError({
      type: ErrorType.CRITICAL,
      message:
        `Insufficient availability to run the booking lifecycle: it needs up to ${requiredUnits} units ` +
        `(${requiredReservations} reservations) but the supplier exposes ${availableUnits} across the ` +
        `validation window. Widen availability (more dates/slots) or increase capacity, then re-run.`,
    });
    return this.buildCapacityFlowResult(error);
  };

  private readonly buildCapacityFlowResult = (error: ValidatorError): FlowResult => {
    const scenario: ScenarioResult = {
      name: 'Availability Capacity Check',
      success: false,
      validationResult: ValidationResult.FAILED,
      request: null,
      response: null,
      errors: [error.mapError()],
      description: 'Verifies the supplier has enough availability to run the booking lifecycle.',
    };
    return {
      name: 'Availability Capacity',
      success: false,
      validationResult: ValidationResult.FAILED,
      totalScenarios: 1,
      succesScenarios: 0,
      scenarios: [scenario],
      docs: '',
    };
  };
}
