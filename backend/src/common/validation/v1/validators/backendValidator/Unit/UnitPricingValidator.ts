import { Pricing, Unit } from '@octocloud/types';
import { PricingValidator } from '../Pricing/PricingValidator';
import { ModelValidator, ValidatorError } from '../ValidatorHelpers';

export class UnitPricingValidator implements ModelValidator {
  private readonly pricingValidator: PricingValidator;
  private readonly path: string;
  public constructor({ path }: { path: string }) {
    this.path = path;
    this.pricingValidator = new PricingValidator(path);
  }

  public validate = (unit: Unit): ValidatorError[] => {
    const isOnBooking = this.path.includes('booking');
    if (isOnBooking) {
      const pricing = unit?.pricing ?? [];
      return pricing
        .flatMap((pricing, i) => {
          this.pricingValidator.setPath(`${this.path}.pricing[${i}]`);
          return this.pricingValidator.validate(pricing);
        })
        .flatMap((v) => (v ? [v] : []));
    } else {
      const pricingFrom = unit?.pricingFrom ?? [];
      return pricingFrom
        .flatMap((pricingFrom, i) => {
          this.pricingValidator.setPath(`${this.path}.pricingFrom[${i}]`);
          return this.pricingValidator.validate(pricingFrom);
        })
        .flatMap((v) => (v ? [v] : []));
    }
  };
}
