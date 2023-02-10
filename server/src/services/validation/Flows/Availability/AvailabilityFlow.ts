import { Context } from "../../context/Context.ts";
import docs from "../../consts/docs.ts";
import { AvailabilityCheckAvailabilityIdScenario } from "../../Scenarios/Availability/AvailabilityCheckAvailabilityId.ts";
import { AvailabilityCheckBadRequestScenario } from "../../Scenarios/Availability/AvailabilityCheckBadRequest.ts";
import { AvailabilityCheckDateScenario } from "../../Scenarios/Availability/AvailabilityCheckDate.ts";
import { AvailabilityChecIntervalScenario } from "../../Scenarios/Availability/AvailabilityCheckInterval.ts";
import { AvailabilityCheckInvalidOptionScenario } from "../../Scenarios/Availability/AvailabilityCheckInvalidOption.ts";
import { AvailabilityCheckInvalidProductScenario } from "../../Scenarios/Availability/AvailabilityCheckInvalidProduct.ts";
import { AvailabilityCheckStatusScenario } from "../../Scenarios/Availability/AvailabilityCheckStatus.ts";
import { BaseFlow } from "../BaseFlow.ts";
import { Flow, FlowResult } from "../Flow.ts";

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
