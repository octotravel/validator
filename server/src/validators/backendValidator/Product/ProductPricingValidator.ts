import { PricingPer, Product } from "npm:@octocloud/types@^1.3.1";
import {
  StringValidator,
  StringArrayValidator,
  EnumValidator,
  ValidatorError,
  ModelValidator,
} from "./../ValidatorHelpers.ts";

export class ProductPricingValidator implements ModelValidator {
  private path: string;
  constructor({ path }: { path: string }) {
    this.path = path;
  }

  public validate = (product?: Product | null): ValidatorError[] => {
    return [
      StringValidator.validate(
        `${this.path}.defaultCurrency`,
        product?.defaultCurrency
      ),
      StringArrayValidator.validate(
        `${this.path}.availableCurrencies`,
        product?.availableCurrencies,
        {
          min: 1,
        }
      ),
      EnumValidator.validate(
        `${this.path}.pricingPer`,
        product?.pricingPer,
        Object.values(PricingPer)
      ),
    ].flatMap((v) => (v ? [v] : []));
  };
}
