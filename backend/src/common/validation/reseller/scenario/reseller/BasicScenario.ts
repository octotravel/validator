import { inject } from '@needle-di/core';
import { CapabilityId } from '@octocloud/types';
import { DoublyLinkedList } from 'linked-list-typed';
import { AvailabilityCalendarStep } from '../../step/reseller/availability/AvailabilityCalendarStep';
import { GetProductStep } from '../../step/reseller/product/GetProductStep';
import { GetProductsStep } from '../../step/reseller/product/GetProductsStep';
import { GetSupplierStep } from '../../step/reseller/supplier/GetSupplierStep';
import { Step } from '../../step/Step';
import { StepLinkedListFactory } from '../../step/StepLinkedListFactory';
import { Scenario } from '../Scenario';
import { ScenarioId } from '../ScenarioId';

export class BasicScenario implements Scenario {
  public readonly capabilities: CapabilityId[] = [];

  public constructor(
    private readonly getSupplierStep = inject(GetSupplierStep),
    private readonly getProductsStep = inject(GetProductsStep),
    private readonly getProductStep = inject(GetProductStep),
    private readonly availabilityCalendarStep = inject(AvailabilityCalendarStep),
  ) {
    this.capabilities = this.getRequiredCapabilities().concat(this.getOptionalCapabilities());
  }

  public getId(): ScenarioId {
    return ScenarioId.BASIC_SCENARIO;
  }

  public getName(): string {
    return 'Basic Scenario';
  }

  public getDescription(): string {
    return 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Maecenas ipsum velit, consectetuer eu lobortis ut, dictum at dui. Morbi scelerisque luctus velit. Ut tempus purus at lorem. Sed convallis magna eu sem. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Etiam commodo dui eget wisi. Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur? Integer pellentesque quam vel velit. Suspendisse nisl. In sem justo, commodo ut, suscipit at, pharetra vitae, orci. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';
  }

  public getRequiredCapabilities(): CapabilityId[] {
    return [CapabilityId.Pricing];
  }

  public getOptionalCapabilities(): CapabilityId[] {
    return [CapabilityId.Cart];
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
    ]);
  }
}
