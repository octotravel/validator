import { inject } from '@needle-di/core';
import { CapabilityId } from '@octocloud/types';
import { DoublyLinkedList } from 'linked-list-typed';
import { AvailabilityCalendarStep } from '../../step/reseller/availability/AvailabilityCalendarStep';
import { AvailabilityCheckStep } from '../../step/reseller/availability/AvailabilityCheckStep';
import { BookingCancellationStep } from '../../step/reseller/booking/BookingCancellationStep';
import { BookingConfirmationStep } from '../../step/reseller/booking/BookingConfirmationStep';
import { BookingReservationStep } from '../../step/reseller/booking/BookingReservationStep';
import { GetProductStep } from '../../step/reseller/product/GetProductStep';
import { GetProductsStep } from '../../step/reseller/product/GetProductsStep';
import { GetSupplierStep } from '../../step/reseller/supplier/GetSupplierStep';
import { Step } from '../../step/Step';
import { StepLinkedListFactory } from '../../step/StepLinkedListFactory';
import { Scenario } from '../Scenario';
import { ScenarioId } from '../ScenarioId';

export class AdvancedScenario implements Scenario {
  public readonly capabilities: CapabilityId[] = [];

  public constructor(
    private readonly getSupplierStep = inject(GetSupplierStep),
    private readonly getProductsStep = inject(GetProductsStep),
    private readonly getProductStep = inject(GetProductStep),
    private readonly availabilityCalendarStep = inject(AvailabilityCalendarStep),
    private readonly availabilityCheckStep = inject(AvailabilityCheckStep),
    private readonly bookingReservationStep = inject(BookingReservationStep),
    private readonly bookingConfirmationStep = inject(BookingConfirmationStep),
    private readonly bookingCancellationStep = inject(BookingCancellationStep),
  ) {
    this.capabilities = this.getRequiredCapabilities().concat(this.getOptionalCapabilities());
  }

  public getId(): ScenarioId {
    return ScenarioId.ADVANCED_SCENARIO;
  }

  public getName(): string {
    return 'Advanced Scenario';
  }

  public getDescription(): string {
    return 'An API validator is a crucial component in ensuring the reliability, security, and proper functioning of APIs. Our OCTO API validator acts as a gatekeeper, verifying that incoming requests and outgoing responses adhere to predefined rules, formats, and schemas. This validation process is vital for maintaining data integrity, preventing errors, and safeguarding against malicious inputs. Following is a set of scenarios to validate basic OCTO API functions eagerly waiting for your calls.';
  }

  public getRequiredCapabilities(): CapabilityId[] {
    return [];
  }

  public getOptionalCapabilities(): CapabilityId[] {
    return [CapabilityId.Pricing, CapabilityId.Cart];
  }

  public getCapabilities(): CapabilityId[] {
    return this.capabilities;
  }

  public getSteps(): DoublyLinkedList<Step> {
    return StepLinkedListFactory.create([
      this.getSupplierStep,
      this.getProductsStep,
      this.getProductStep,
      this.availabilityCalendarStep,
      this.availabilityCheckStep,
      this.bookingReservationStep,
      this.bookingConfirmationStep,
      this.bookingCancellationStep,
    ]);
  }
}
