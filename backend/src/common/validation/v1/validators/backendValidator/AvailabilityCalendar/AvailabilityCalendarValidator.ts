import { AvailabilityCalendar, AvailabilityStatus, AvailabilityType, CapabilityId } from '@octocloud/types';
import { CommonValidator } from '../CommonValidator';
import {
  BooleanValidator,
  EnumValidator,
  ModelValidator,
  NumberValidator,
  StringValidator,
  ValidatorError,
} from '../ValidatorHelpers';
import { AvailabilityCalendarPricingValidator } from './AvailabilityCalendarPricingValidator';

export class AvailabilityCalendarValidator implements ModelValidator {
  private readonly pricingValidator: AvailabilityCalendarPricingValidator;
  private readonly path: string;
  private readonly availabilityType: AvailabilityType;
  private readonly capabilities: CapabilityId[];
  public constructor({
    path,
    capabilities,
    availabilityType,
  }: {
    path: string;
    capabilities: CapabilityId[];
    availabilityType: AvailabilityType;
  }) {
    this.path = `${path}`;
    this.availabilityType = availabilityType;
    this.capabilities = capabilities;
    this.pricingValidator = new AvailabilityCalendarPricingValidator({
      path: this.path,
    });
  }

  public validate = (availability: AvailabilityCalendar): ValidatorError[] => {
    return [
      StringValidator.validate(`${this.path}.localDate`, availability?.localDate),
      CommonValidator.validateLocalDate(`${this.path}.localDate`, availability?.localDate),

      BooleanValidator.validate(`${this.path}.available`, availability?.available),
      EnumValidator.validate(`${this.path}.status`, availability?.status, Object.values(AvailabilityStatus)),
      NumberValidator.validate(`${this.path}.vacancies`, availability?.vacancies, {
        nullable: true,
      }),
      NumberValidator.validate(`${this.path}.capacity`, availability?.capacity, {
        nullable: true,
      }),

      ...CommonValidator.validateOpeningHours(this.path, availability?.openingHours ?? [], this.availabilityType),
      ...this.validatePricingCapability(availability),
    ].flatMap((v) => (v ? [v] : []));
  };

  private readonly validatePricingCapability = (availability: AvailabilityCalendar): ValidatorError[] => {
    if (this.capabilities.includes(CapabilityId.Pricing)) {
      return this.pricingValidator.validate(availability);
    }
    return [];
  };
}
