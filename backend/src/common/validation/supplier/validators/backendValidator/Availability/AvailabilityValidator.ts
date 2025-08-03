import { Availability, AvailabilityStatus, AvailabilityType, CapabilityId } from '@octocloud/types';
import { CommonValidator } from '../CommonValidator';
import {
  BooleanValidator,
  EnumValidator,
  ModelValidator,
  NumberValidator,
  StringValidator,
  ValidatorError,
} from '../ValidatorHelpers';
import { AvailabilityPickupValidator } from './AvailabilityPickupValidator';
import { AvailabilityPricingValidator } from './AvailabilityPricingValidator';

export class AvailabilityValidator implements ModelValidator {
  private readonly pricingValidator: AvailabilityPricingValidator;
  private readonly pickupValidator: AvailabilityPickupValidator;
  private readonly availabilityType?: AvailabilityType;
  private readonly path: string;
  private readonly capabilities: CapabilityId[];
  public constructor({
    path,
    capabilities,
    availabilityType,
  }: {
    path?: string;
    capabilities: CapabilityId[];
    availabilityType?: AvailabilityType;
  }) {
    this.path = path || 'availability';
    this.capabilities = capabilities;
    this.availabilityType = availabilityType;
    this.pricingValidator = new AvailabilityPricingValidator({
      path: this.path,
    });
    this.pickupValidator = new AvailabilityPickupValidator({
      path: this.path,
    });
  }

  public validate = (availability: Availability): ValidatorError[] => {
    return [
      StringValidator.validate(`${this.path}.id`, availability?.id),

      StringValidator.validate(`${this.path}.localDateTimeStart`, availability?.localDateTimeStart),
      CommonValidator.validateLocalDateTime(`${this.path}.localDateTimeStart`, availability?.localDateTimeStart),

      StringValidator.validate(`${this.path}.localDateTimeEnd`, availability?.localDateTimeEnd),
      CommonValidator.validateLocalDateTime(`${this.path}.localDateTimeEnd`, availability?.localDateTimeEnd),

      this.validateAllDay(availability),
      BooleanValidator.validate(`${this.path}.available`, availability?.available),
      EnumValidator.validate(`${this.path}.status`, availability?.status, Object.values(AvailabilityStatus)),
      NumberValidator.validate(`${this.path}.vacancies`, availability?.vacancies, {
        nullable: true,
      }),
      NumberValidator.validate(`${this.path}.capacity`, availability?.capacity, {
        nullable: true,
      }),
      NumberValidator.validate(`${this.path}.maxUnits`, availability?.maxUnits, {
        nullable: true,
      }),

      StringValidator.validate(`${this.path}.utcCutoffAt`, availability?.utcCutoffAt),
      CommonValidator.validateUTCDate(`${this.path}.utcCutoffAt`, availability?.utcCutoffAt),

      ...CommonValidator.validateOpeningHours(this.path, availability?.openingHours ?? [], this.availabilityType),

      ...this.validatePricingCapability(availability),
      ...this.validatePickupCapability(availability),
    ]
      .flat(1)
      .flatMap((v) => (v ? [v] : []));
  };

  private readonly validateAllDay = (availability: Availability): ValidatorError | null => {
    const path = `${this.path}.allDay`;
    if (this.availabilityType) {
      return BooleanValidator.validate(path, availability?.allDay, {
        equalsTo: this.availabilityType === AvailabilityType.OPENING_HOURS,
      });
    }
    return BooleanValidator.validate(path, availability?.allDay);
  };

  private readonly validatePricingCapability = (availability: Availability): ValidatorError[] => {
    if (this.capabilities.includes(CapabilityId.Pricing)) {
      return this.pricingValidator.validate(availability);
    }
    return [];
  };

  private readonly validatePickupCapability = (availability: Availability): ValidatorError[] => {
    if (this.capabilities.includes(CapabilityId.Pickups)) {
      return this.pickupValidator.validate(availability);
    }
    return [];
  };
}
