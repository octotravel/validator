import { Context } from "../../context/Context";
import docs from "../../consts/docs";
import { AvailabilityCheckAvailabilityIdScenario } from "../../Scenarios/Availability/AvailabilityCheckAvailabilityId";
import { AvailabilityCheckBadRequestScenario } from "../../Scenarios/Availability/AvailabilityCheckBadRequest";
import { AvailabilityCheckDateScenario } from "../../Scenarios/Availability/AvailabilityCheckDate";
import { AvailabilityChecIntervalScenario } from "../../Scenarios/Availability/AvailabilityCheckInterval";
import { AvailabilityCheckInvalidOptionScenario } from "../../Scenarios/Availability/AvailabilityCheckInvalidOption";
import { AvailabilityCheckInvalidProductScenario } from "../../Scenarios/Availability/AvailabilityCheckInvalidProduct";
import { AvailabilityCheckStatusScenario } from "../../Scenarios/Availability/AvailabilityCheckStatus";
import { BaseFlow } from "../BaseFlow";
import { Flow, FlowResult } from "../Flow";

export class AvailabilityFlow extends BaseFlow implements Flow {
  constructor() {
    super("Availability Check", docs.availabilityCheck);
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
    return this.validateScenarios(scenarios, context);
  };

  private checkInterval = (context: Context) => {
    return context.productConfig.productsForAvailabilityCheck.map(
      (product) => new AvailabilityChecIntervalScenario(product)
    );
  };

  private checkDate = (context: Context) => {
    return context.productConfig.productsForAvailabilityCheck.map(
      (product) => new AvailabilityCheckDateScenario(product)
    );
  };

  private checkAvailabilityID = (context: Context) => {
    return context.productConfig.productsForAvailabilityCheck.map(
      (product) => new AvailabilityCheckAvailabilityIdScenario(product)
    );
  };

  private checkAvailabilityStatus = (context: Context) => {
    const scenarios = [];
    if (context.productConfig.hasStartTimeProducts) {
      scenarios.push(
        new AvailabilityCheckStatusScenario(
          context.productConfig.startTimeProducts
        )
      );
    }
    if (context.productConfig.hasOpeningHourProducts) {
      scenarios.push(
        new AvailabilityCheckStatusScenario(
          context.productConfig.openingHourProducts
        )
      );
    }
    return scenarios;
  };
}
