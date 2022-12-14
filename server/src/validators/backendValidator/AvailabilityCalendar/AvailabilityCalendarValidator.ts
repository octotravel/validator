import {
  AvailabilityStatus,
  CapabilityId,
  AvailabilityCalendar,
  AvailabilityType,
} from "https://esm.sh/@octocloud/types@1.3.1";
import { CommonValidator } from "../CommonValidator.ts";
import {
  StringValidator,
  BooleanValidator,
  EnumValidator,
  NumberValidator,
  ModelValidator,
  ValidatorError,
} from "../ValidatorHelpers.ts";
import { AvailabilityCalendarPricingValidator } from "./AvailabilityCalendarPricingValidator.ts";

export class AvailabilityCalendarValidator implements ModelValidator {
  private pricingValidator: AvailabilityCalendarPricingValidator;
  private path: string;
  private availabilityType: AvailabilityType;
  private capabilities: CapabilityId[];
  constructor({
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
      StringValidator.validate(
        `${this.path}.localDate`,
        availability?.localDate
      ),
      CommonValidator.validateLocalDate(
        `${this.path}.localDate`,
        availability?.localDate
      ),

      BooleanValidator.validate(
        `${this.path}.available`,
        availability?.available
      ),
      EnumValidator.validate(
        `${this.path}.status`,
        availability?.status,
        Object.values(AvailabilityStatus)
      ),
      NumberValidator.validate(
        `${this.path}.vacancies`,
        availability?.vacancies,
        {
          nullable: true,
        }
      ),
      NumberValidator.validate(
        `${this.path}.capacity`,
        availability?.capacity,
        {
          nullable: true,
        }
      ),

      ...CommonValidator.validateOpeningHours(
        this.path,
        availability?.openingHours ?? [],
        this.availabilityType
      ),
      ...this.validatePricingCapability(availability),
    ].flatMap((v) => (v ? [v] : []));
  };

  private validatePricingCapability = (
    availability: AvailabilityCalendar
  ): ValidatorError[] => {
    if (this.capabilities.includes(CapabilityId.Pricing)) {
      return this.pricingValidator.validate(availability);
    }
    return [];
  };
}
