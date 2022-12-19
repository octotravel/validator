import { Unit, Pricing } from "https://esm.sh/@octocloud/types@1.3.1";
import { PricingValidator } from "../Pricing/PricingValidator.ts";
import { ModelValidator, ValidatorError } from "../ValidatorHelpers.ts";

export class UnitPricingValidator implements ModelValidator {
  private pricingValidator: PricingValidator;
  private path: string;
  constructor({ path }: { path: string }) {
    this.path = path;
    this.pricingValidator = new PricingValidator(path);
  }

  public validate = (unit: Unit): ValidatorError[] => {
    const isOnBooking = this.path.includes("booking");
    if (isOnBooking) {
      const pricing = unit?.pricing ?? []
      return pricing
      .map((pricing, i) => {
          this.pricingValidator.setPath(`${this.path}.pricing[${i}]`);
          return this.pricingValidator.validate(pricing as Pricing);
        })
        .flat(1)
        .flatMap((v) => (v ? [v] : []));
    } else {
      const pricingFrom = unit?.pricingFrom ?? []
      return pricingFrom.map((pricingFrom, i) => {
          this.pricingValidator.setPath(`${this.path}.pricingFrom[${i}]`);
          return this.pricingValidator.validate(pricingFrom as Pricing);
        })
        .flat(1)
        .flatMap((v) => (v ? [v] : []));
    }
  };
}
