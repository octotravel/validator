import { PricingPer, Product } from '@octocloud/types';
import {
  EnumValidator,
  ModelValidator,
  StringArrayValidator,
  StringValidator,
  ValidatorError,
} from '../ValidatorHelpers';

export class ProductPricingValidator implements ModelValidator {
  private readonly path: string;
  public constructor({ path }: { path: string }) {
    this.path = path;
  }

  public validate = (product?: Product | null): ValidatorError[] => {
    return [
      StringValidator.validate(`${this.path}.defaultCurrency`, product?.defaultCurrency),
      StringArrayValidator.validate(`${this.path}.availableCurrencies`, product?.availableCurrencies, {
        min: 1,
      }),
      EnumValidator.validate(`${this.path}.pricingPer`, product?.pricingPer, Object.values(PricingPer)),
    ].flatMap((v) => (v ? [v] : []));
  };
}
