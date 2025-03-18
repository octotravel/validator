import { AvailabilityCheckAvailabilityIdScenario } from '../../Scenarios/Availability/AvailabilityCheckAvailabilityId';
import { AvailabilityCheckBadRequestScenario } from '../../Scenarios/Availability/AvailabilityCheckBadRequest';
import { AvailabilityCheckDateScenario } from '../../Scenarios/Availability/AvailabilityCheckDate';
import { AvailabilityChecIntervalScenario } from '../../Scenarios/Availability/AvailabilityCheckInterval';
import { AvailabilityCheckInvalidOptionScenario } from '../../Scenarios/Availability/AvailabilityCheckInvalidOption';
import { AvailabilityCheckInvalidProductScenario } from '../../Scenarios/Availability/AvailabilityCheckInvalidProduct';
import { AvailabilityCheckStatusScenario } from '../../Scenarios/Availability/AvailabilityCheckStatus';
import docs from '../../consts/docs';
import { Context } from '../../context/Context';
import { BaseFlow } from '../BaseFlow';
import { Flow, FlowResult } from '../Flow';

export class AvailabilityFlow extends BaseFlow implements Flow {
  public constructor() {
    super('Availability Check', docs.availabilityCheck);
  }

  public validate = async (context: Context): Promise<FlowResult> => {
    const scenarios = [
      ...this.checkInterval(context),
      ...this.checkDate(context),
      ...this.checkAvailabilityID(context),
      ...this.checkAvailabilityStatus(context),
      new AvailabilityCheckInvalidProductScenario(),
      new AvailabilityCheckInvalidOptionScenario(),
      new AvailabilityCheckBadRequestScenario(),
    ];
    return await this.validateScenarios(scenarios, context);
  };

  private readonly checkInterval = (context: Context): AvailabilityChecIntervalScenario[] => {
    return context.productConfig.productsForAvailabilityCheck.map(
      (product) => new AvailabilityChecIntervalScenario(product),
    );
  };

  private readonly checkDate = (context: Context): AvailabilityCheckDateScenario[] => {
    return context.productConfig.productsForAvailabilityCheck.map(
      (product) => new AvailabilityCheckDateScenario(product),
    );
  };

  private readonly checkAvailabilityID = (context: Context): AvailabilityCheckAvailabilityIdScenario[] => {
    if (context.availabilityConfig.skipAvailabilityIdsChecks) {
      return [];
    }

    return context.productConfig.productsForAvailabilityCheck.map(
      (product) => new AvailabilityCheckAvailabilityIdScenario(product),
    );
  };

  private readonly checkAvailabilityStatus = (context: Context): AvailabilityCheckStatusScenario[] => {
    const scenarios = [];
    if (context.productConfig.hasStartTimeProducts) {
      scenarios.push(new AvailabilityCheckStatusScenario(context.productConfig.startTimeProducts));
    }
    if (context.productConfig.hasOpeningHourProducts) {
      scenarios.push(new AvailabilityCheckStatusScenario(context.productConfig.openingHourProducts));
    }
    return scenarios;
  };
}
