import { Availability, Pricing, PricingUnit } from '@octocloud/types';
import { PricingValidator } from '../Pricing/PricingValidator';
import { ModelValidator, StringValidator, ValidatorError } from '../ValidatorHelpers';

export class AvailabilityPricingValidator implements ModelValidator {
  private readonly pricingValidator: PricingValidator;
  private readonly path: string;
  public constructor({ path }: { path: string }) {
    this.path = path;
    this.pricingValidator = new PricingValidator(this.path);
  }

  public validate = (availability: Availability): ValidatorError[] => {
    if (availability?.unitPricing) {
      return this.validateUnitPricing(availability?.unitPricing);
    } else {
      return this.validatePricing(availability?.pricing!);
    }
  };

  private readonly validateUnitPricing = (unitPricing: PricingUnit[]): ValidatorError[] => {
    return unitPricing
      .flatMap((pricing, i) => {
        const path = `${this.path}.unitPricing[${i}]`;
        this.pricingValidator.setPath(path);
        return [
          ...this.pricingValidator.validate(pricing),
          StringValidator.validate(`${path}.unitId`, pricing?.unitId),
        ];
      })
      .flatMap((v) => (v ? [v] : []));
  };

  private readonly validatePricing = (pricing: Pricing): ValidatorError[] => {
    this.pricingValidator.setPath(`${this.path}.pricing`);
    return this.pricingValidator.validate(pricing);
  };
}
