import { PricingUnit, Availability, Pricing } from "https://esm.sh/@octocloud/types@1.3.1";
import {
  StringValidator,
  ModelValidator,
  ValidatorError,
} from "../ValidatorHelpers.ts";
import { PricingValidator } from "../Pricing/PricingValidator.ts";

export class AvailabilityPricingValidator implements ModelValidator {
  private pricingValidator: PricingValidator;
  private path: string;
  constructor({ path }: { path: string }) {
    this.path = path;
    this.pricingValidator = new PricingValidator(this.path);
  }

  public validate = (availability: Availability): ValidatorError[] => {
    if (availability?.unitPricing) {
      return this.validateUnitPricing(
        availability?.unitPricing as PricingUnit[]
      );
    } else {
      return this.validatePricing(availability?.pricing as Pricing);
    }
  };

  private validateUnitPricing = (
    unitPricing: PricingUnit[]
  ): ValidatorError[] => {
    return unitPricing
      .map((pricing, i) => {
        const path = `${this.path}.unitPricing[${i}]`;
        this.pricingValidator.setPath(path);
        return [
          ...this.pricingValidator.validate(pricing),
          StringValidator.validate(`${path}.unitId`, pricing?.unitId),
        ];
      })
      .flat(1)
      .flatMap((v) => (v ? [v] : []));
  };

  private validatePricing = (pricing: Pricing): ValidatorError[] => {
    this.pricingValidator.setPath(`${this.path}.pricing`);
    return this.pricingValidator.validate(pricing);
  };
}
