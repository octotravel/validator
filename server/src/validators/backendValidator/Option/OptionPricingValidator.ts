import { Pricing, Option } from "@octocloud/types";
import { PricingValidator } from "../Pricing/PricingValidator";
import { ModelValidator, ValidatorError } from "../ValidatorHelpers";

export class OptionPricingValidator implements ModelValidator {
  private pricingValidator: PricingValidator;
  private path: string;
  constructor({ path }: { path: string }) {
    this.path = path;
    this.pricingValidator = new PricingValidator(path);
  }

  public validate = (option?: Nullable<Option>): ValidatorError[] => {
    const isOnBooking = this.path.includes("booking");
    if (isOnBooking) {
      const pricing = option?.pricing ?? []
      return pricing
        ?.map((pricing, i) => {
          this.pricingValidator.setPath(`${this.path}.pricing[${i}]`);
          return this.pricingValidator.validate(pricing as Pricing);
        })
        .flat(1);
    } else {
      const pricingFrom = option?.pricingFrom ?? []
      return pricingFrom
        .map((pricingFrom, i) => {
          this.pricingValidator.setPath(`${this.path}.pricingFrom[${i}]`);
          return this.pricingValidator.validate(pricingFrom as Pricing);
        })
        .flat(1);
    }
  };
}
