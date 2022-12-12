import { Config } from "../../config/Config.ts";
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
  public config = Config.getInstance();
  constructor() {
    super("Availability Check", docs.availabilityCheck);
  }

  public validate = async (): Promise<FlowResult> => {
    const scenarios = [
      ...this.checkInterval(),
      ...this.checkDate(),
      ...this.checkAvailabilityID(),
      ...this.checkAvailabilityStatus(),
      new AvailabilityCheckInvalidProductScenario(),
      new AvailabilityCheckInvalidOptionScenario(),
      new AvailabilityCheckBadRequestScenario(),
    ];
    return this.validateScenarios(scenarios);
  };

  private checkInterval = () => {
    return this.config.productConfig.productsForAvailabilityCheck.map(
      (product) => new AvailabilityChecIntervalScenario(product)
    );
  };

  private checkDate = () => {
    return this.config.productConfig.productsForAvailabilityCheck.map(
      (product) => new AvailabilityCheckDateScenario(product)
    );
  };

  private checkAvailabilityID = () => {
    return this.config.productConfig.productsForAvailabilityCheck.map(
      (product) => new AvailabilityCheckAvailabilityIdScenario(product)
    );
  };

  private checkAvailabilityStatus = () => {
    const scenarios = [];
    if (this.config.productConfig.hasStartTimeProducts) {
      scenarios.push(
        new AvailabilityCheckStatusScenario(
          this.config.productConfig.startTimeProducts
        )
      );
    }
    if (this.config.productConfig.hasOpeningHourProducts) {
      scenarios.push(
        new AvailabilityCheckStatusScenario(
          this.config.productConfig.openingHourProducts
        )
      );
    }
    return scenarios;
  };
}
