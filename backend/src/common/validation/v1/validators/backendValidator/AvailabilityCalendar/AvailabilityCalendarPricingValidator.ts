import { PricingUnit, Pricing, AvailabilityCalendar } from '@octocloud/types';
import { StringValidator, ModelValidator, ValidatorError } from '../ValidatorHelpers';
import { PricingValidator } from '../Pricing/PricingValidator';

export class AvailabilityCalendarPricingValidator implements ModelValidator {
  private readonly pricingValidator: PricingValidator;
  private readonly path: string;

  public constructor({ path }: { path: string }) {
    this.path = path;
    this.pricingValidator = new PricingValidator(this.path);
  }

  public validate = (availability: AvailabilityCalendar): ValidatorError[] => {
    if (availability?.unitPricingFrom) {
      return this.validateUnitPricing(availability?.unitPricingFrom ?? ([] as PricingUnit[]));
    } else {
      return this.validatePricing(availability?.pricingFrom!);
    }
  };

  private readonly validateUnitPricing = (unitPricing: PricingUnit[]): ValidatorError[] => {
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

  private readonly validatePricing = (pricing: Pricing): ValidatorError[] => {
    this.pricingValidator.setPath(`${this.path}.pricing`);
    return this.pricingValidator.validate(pricing);
  };
}
