import {
  CapabilityId,
  Restrictions,
  Unit,
  ContactField,
  PricingPer,
} from "@octocloud/types";
import {
  StringValidator,
  BooleanValidator,
  EnumArrayValidator,
  NumberValidator,
  ModelValidator,
  ValidatorError,
  StringArrayValidator,
} from "../ValidatorHelpers";
import { UnitPricingValidator } from "./UnitPricingValidator";

export class UnitValidator implements ModelValidator {
  private path: string;
  private capabilities: CapabilityId[];
  private shouldWarnOnNonHydrated: boolean;
  constructor({
    path,
    capabilities,
    shouldWarnOnNonHydrated = false,
  }: {
    path: string;
    capabilities: CapabilityId[];
    shouldWarnOnNonHydrated?: boolean;
  }) {
    this.path = path;
    this.capabilities = capabilities;
    this.shouldWarnOnNonHydrated = shouldWarnOnNonHydrated;
  }
  public validate = (unit: Unit, pricingPer?: PricingPer): ValidatorError[] => {
    const shouldWarn = this.shouldWarnOnNonHydrated;
    return [
      StringValidator.validate(`${this.path}.id`, unit?.id, { shouldWarn }),
      StringValidator.validate(`${this.path}.internalName`, unit?.internalName, { shouldWarn }),
      StringValidator.validate(`${this.path}.reference`, unit?.reference, {
        nullable: true,
        shouldWarn,
      }),
      StringValidator.validate(`${this.path}.type`, unit?.type, {
        nullable: true,
        shouldWarn,
      }),
      ...this.validateRestrictions(unit?.restrictions),
      EnumArrayValidator.validate(
        `${this.path}.requiredContactFields`,
        unit?.requiredContactFields,
        Object.values(ContactField),
        { shouldWarn }
      ),
      ...this.validatePricingCapability(unit, pricingPer),
    ].flatMap((v) => (v ? [v] : []));
  };

  private validatePricingCapability = (
    unit: Unit,
    pricingPer?: PricingPer
  ): ValidatorError[] => {
    if (
      this.capabilities.includes(CapabilityId.Pricing) &&
      pricingPer === PricingPer.UNIT
    ) {
      const pricingValidator = new UnitPricingValidator({
        path: this.path,
      });
      return pricingValidator.validate(unit);
    }
    return [];
  };

  private validateRestrictions = (
    restrictions: Restrictions
  ): ValidatorError[] => {
    const shouldWarn = this.shouldWarnOnNonHydrated;
    return [
      NumberValidator.validate(
        `${this.path}.restrictions.minAge`,
        restrictions?.minAge,
        {
          integer: true,
          shouldWarn
        }
      ),
      NumberValidator.validate(
        `${this.path}.restrictions.maxAge`,
        restrictions?.maxAge,
        {
          integer: true,
          shouldWarn
        }
      ),
      BooleanValidator.validate(
        `${this.path}.restrictions.idRequired`,
        restrictions?.idRequired,
        { shouldWarn }
      ),
      NumberValidator.validate(
        `${this.path}.restrictions.minQuantity`,
        restrictions?.minQuantity,
        { integer: true, nullable: true, shouldWarn }
      ),
      NumberValidator.validate(
        `${this.path}.restrictions.maxQuantity`,
        restrictions?.maxQuantity,
        { integer: true, nullable: true, shouldWarn }
      ),
      NumberValidator.validate(
        `${this.path}.restrictions.paxCount`,
        restrictions?.paxCount,
        { integer: true, shouldWarn }
      ),
      StringArrayValidator.validate(
        `${this.path}.restrictions.accompaniedBy`,
        restrictions?.accompaniedBy,
        { shouldWarn }
      ),
    ].flatMap((v) => (v ? [v] : []));
  };
}
