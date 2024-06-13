import {
  CapabilityId,
  Unit,
  ContactField,
  Option,
  OptionRestrictions,
  PricingPer,
  AvailabilityType,
} from '@octocloud/types';
import { OptionPickupValidator } from './OptionPickupValidator';
import { UnitValidator } from '../Unit/UnitValidator';
import {
  StringValidator,
  RegExpArrayValidator,
  BooleanValidator,
  EnumArrayValidator,
  NumberValidator,
  ValidatorError,
  ModelValidator,
  ArrayValidator,
} from '../ValidatorHelpers';
import { OptionPricingValidator } from './OptionPricingValidator';

export class OptionValidator implements ModelValidator {
  private readonly path: string;
  private readonly capabilities: CapabilityId[];
  private readonly shouldNotHydrate: boolean;
  public constructor({
    path,
    capabilities,
    shouldNotHydrate = false,
  }: {
    path: string;
    capabilities: CapabilityId[];
    shouldNotHydrate?: boolean;
  }) {
    this.path = path;
    this.capabilities = capabilities;
    this.shouldNotHydrate = shouldNotHydrate;
  }

  public validate = (
    option?: Option | null,
    availabilityType?: AvailabilityType,
    pricingPer?: PricingPer,
  ): ValidatorError[] => {
    const shouldWarn = this.shouldNotHydrate;
    return [
      StringValidator.validate(`${this.path}.id`, option?.id),
      BooleanValidator.validate(`${this.path}.default`, option?.default, { shouldWarn }),
      StringValidator.validate(`${this.path}.internalName`, option?.internalName, { shouldWarn }),
      StringValidator.validate(`${this.path}.reference`, option?.reference, {
        nullable: true,
        shouldWarn,
      }),
      this.validateAvailabilityLocalStartTimes(option?.availabilityLocalStartTimes ?? [], availabilityType),
      StringValidator.validate(`${this.path}.cancellationCutoff`, option?.cancellationCutoff, { shouldWarn }),
      NumberValidator.validate(`${this.path}.cancellationCutoffAmount`, option?.cancellationCutoffAmount, {
        integer: true,
        shouldWarn,
      }),
      StringValidator.validate(`${this.path}.cancellationCutoffUnit`, option?.cancellationCutoffUnit, { shouldWarn }),
      EnumArrayValidator.validate(
        `${this.path}.requiredContactFields`,
        option?.requiredContactFields,
        Object.values(ContactField),
        { shouldWarn },
      ),
      ...this.validateUnitRestrictions(option?.restrictions),
      ...this.validateUnits(option?.units ?? [], pricingPer),

      ...this.validatePricingCapability(option, pricingPer),
      ...this.validatePickupCapability(option),
    ].flatMap((v) => (v ? [v] : []));
  };

  private readonly validateAvailabilityLocalStartTimes = (
    availabilityLocalStartTimes: string[],
    availabilityType?: AvailabilityType,
  ): ValidatorError | null => {
    const path = `${this.path}.availabilityLocalStartTimes`;
    if (availabilityType === AvailabilityType.OPENING_HOURS) {
      return ArrayValidator.validate(path, availabilityLocalStartTimes, {
        empty: true,
      });
    }

    return RegExpArrayValidator.validate(path, availabilityLocalStartTimes, /^\d{2}:\d{2}$/g, { min: 1 });
  };

  private readonly validateUnitRestrictions = (restrictions?: OptionRestrictions): ValidatorError[] =>
    [
      NumberValidator.validate(`${this.path}.restrictions.minUnits`, restrictions?.minUnits, {
        integer: true,
        shouldWarn: this.shouldNotHydrate,
      }),
      NumberValidator.validate(`${this.path}.restrictions.maxUnits`, restrictions?.maxUnits, {
        nullable: true,
        integer: true,
        shouldWarn: this.shouldNotHydrate,
      }),
    ].flatMap((v) => (v ? [v] : []));

  private readonly validateUnits = (
    units: Unit[],
    pricingPer?: PricingPer,
    shouldWarn: boolean = false,
  ): ValidatorError[] => {
    return units
      .map((unit, i) => {
        const validator = new UnitValidator({
          path: `${this.path}.units[${i}]`,
          capabilities: this.capabilities,
        });
        return validator.validate(unit, pricingPer);
      })
      .flat(1)
      .flatMap((v) => (v ? [v] : []));
  };

  private readonly validatePricingCapability = (option?: Option | null, pricingPer?: PricingPer): ValidatorError[] => {
    if (this.capabilities.includes(CapabilityId.Pricing) && pricingPer === PricingPer.BOOKING) {
      const pricingValidator = new OptionPricingValidator({
        path: `${this.path}`,
      });
      return pricingValidator.validate(option);
    }
    return [];
  };

  private readonly validatePickupCapability = (option?: Option | null): ValidatorError[] => {
    if (this.capabilities.includes(CapabilityId.Pickups)) {
      const pickupValidator = new OptionPickupValidator({
        path: `${this.path}`,
      });
      return pickupValidator.validate(option);
    }
    return [];
  };
}
