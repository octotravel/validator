import { Availability, AvailabilityStatus, AvailabilityType, CapabilityId } from '@octocloud/types';
import { CommonValidator } from '../CommonValidator';
import {
  StringValidator,
  BooleanValidator,
  EnumValidator,
  NumberValidator,
  RegExpValidator,
  ModelValidator,
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
      this.validateLocalDateTime(`${this.path}.localDateTimeStart`, availability?.localDateTimeStart),

      StringValidator.validate(`${this.path}.localDateTimeEnd`, availability?.localDateTimeEnd),
      this.validateLocalDateTime(`${this.path}.localDateTimeEnd`, availability?.localDateTimeEnd),

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
      this.validateUTCDate(`${this.path}.utcCutoffAt`, availability?.utcCutoffAt),

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

  private readonly validateLocalDateTime = (label: string, localDateTime: string): ValidatorError | null => {
    const regExp =
      /^(?:[1-9]\d{3}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1\d|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[1-9]\d(?:0[48]|[2468][048]|[13579][26])|(?:[2468][048]|[13579][26])00)-02-29)T(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d(?:\.\d{1,9})?(?:Z|[+-][01]\d:[0-5]\d)$/;
    return RegExpValidator.validate(label, localDateTime, regExp);
  };

  private readonly validateUTCDate = (label: string, utcDate: string): ValidatorError | null => {
    const regExp = /^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])T([01][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])Z$/;
    return RegExpValidator.validate(label, utcDate, regExp);
  };
}
