import {
  AvailabilityType,
  CapabilityId,
  DeliveryFormat,
  DeliveryMethod,
  Product,
  RedemptionMethod,
} from '@octocloud/types';
import { OptionValidator } from '../Option/OptionValidator';
import {
  ArrayValidator,
  BooleanValidator,
  EnumArrayValidator,
  EnumValidator,
  ModelValidator,
  StringValidator,
  ValidatorError,
} from '../ValidatorHelpers';
import { ProductContentValidator } from './ProductContentValidator';
import { ProductPricingValidator } from './ProductPricingValidator';

export class ProductValidator implements ModelValidator {
  private readonly pricingValidator: ProductPricingValidator;
  private readonly contentValidator: ProductContentValidator;
  private readonly path: string;
  private readonly capabilities: CapabilityId[];
  private readonly shouldNotHydrate: boolean;

  public constructor({
    path = '',
    capabilities,
    shouldNotHydrate = false,
  }: {
    path?: string;
    capabilities: CapabilityId[];
    shouldNotHydrate?: boolean;
  }) {
    this.path = path || 'product';
    this.capabilities = capabilities;
    this.pricingValidator = new ProductPricingValidator({ path: this.path });
    this.contentValidator = new ProductContentValidator({ path: this.path });
    this.shouldNotHydrate = shouldNotHydrate;
  }

  public validate = (product?: Product | null): ValidatorError[] => {
    const shouldWarn = this.shouldNotHydrate;
    return [
      StringValidator.validate(`${this.path}.id`, product?.id),
      StringValidator.validate(`${this.path}.internalName`, product?.internalName, { shouldWarn }),
      StringValidator.validate(`${this.path}.reference`, product?.reference, {
        nullable: true,
        shouldWarn,
      }),
      StringValidator.validate(`${this.path}.locale`, product?.locale, { shouldWarn }),
      StringValidator.validate(`${this.path}.timeZone`, product?.timeZone, { shouldWarn }),
      BooleanValidator.validate(`${this.path}.allowFreesale`, product?.allowFreesale, { shouldWarn }),
      BooleanValidator.validate(`${this.path}.instantConfirmation`, product?.instantConfirmation, { shouldWarn }),
      BooleanValidator.validate(`${this.path}.instantDelivery`, product?.instantDelivery, { shouldWarn }),
      BooleanValidator.validate(`${this.path}.availabilityRequired`, product?.availabilityRequired, { shouldWarn }),
      EnumValidator.validate(
        `${this.path}.availabilityType`,
        product?.availabilityType,
        [AvailabilityType.START_TIME, AvailabilityType.OPENING_HOURS],
        { shouldWarn },
      ),
      EnumArrayValidator.validate(
        `${this.path}.deliveryFormats`,
        product?.deliveryFormats,
        Object.values(DeliveryFormat),
        { min: 1, shouldWarn },
      ),
      EnumArrayValidator.validate(
        `${this.path}.deliveryMethods`,
        product?.deliveryMethods,
        Object.values(DeliveryMethod),
        { min: 1, shouldWarn },
      ),
      EnumValidator.validate(
        `${this.path}.redemptionMethod`,
        product?.redemptionMethod,
        [RedemptionMethod.DIGITAL, RedemptionMethod.PRINT, RedemptionMethod.MANIFEST],
        { shouldWarn },
      ),
      ...this.validateOptions(product),

      ...this.validatePricingCapability(product),
      ...this.validateContentCapability(product),
    ].flatMap((v) => (v ? [v] : []));
  };

  private readonly validateOptions = (product?: Product | null): ValidatorError[] => {
    const options = product?.options ?? [];
    const errors = [
      ArrayValidator.validate(`${this.path}.options`, options, { min: 1, shouldWarn: this.shouldNotHydrate }),
    ];
    errors.push(
      ...options.flatMap((option, i) => {
        const optionValidator = new OptionValidator({
          path: `${this.path}.options[${i}]`,
          capabilities: this.capabilities,
          shouldNotHydrate: this.shouldNotHydrate,
        });
        return optionValidator.validate(option, product?.availabilityType, product?.pricingPer);
      }),
    );

    return errors.flatMap((v) => (v ? [v] : []));
  };

  private readonly validatePricingCapability = (product?: Product | null): ValidatorError[] => {
    if (this.capabilities.includes(CapabilityId.Pricing)) {
      return this.pricingValidator.validate(product);
    }
    return [];
  };

  private readonly validateContentCapability = (product?: Product | null): ValidatorError[] => {
    if (this.capabilities.includes(CapabilityId.Content)) {
      return this.contentValidator.validate(product);
    }
    return [];
  };
}
