import { CapabilityId, Supplier } from "https://esm.sh/@octocloud/types@1.4.8";
import {
  ModelValidator,
  StringValidator,
  ValidatorError,
} from "../ValidatorHelpers.ts";
import { SupplierContentValidator } from "./SupplierContentValidator.ts";

export class SupplierValidator implements ModelValidator {
  private path: string;
  private capabilities: CapabilityId[];
  private contentValidator: SupplierContentValidator;

  constructor({
    path = "",
    capabilities,
  }: {
    path?: string;
    capabilities: CapabilityId[];
  }) {
    this.path = path ? `${path}supplier` : `supplier`;
    this.capabilities = capabilities;
    this.contentValidator = new SupplierContentValidator({ path: this.path });
  }

  public validate = (supplier: Supplier | null): ValidatorError[] => {
    return [
      StringValidator.validate(`${this.path}.id`, supplier?.id),
      StringValidator.validate(`${this.path}.name`, supplier?.name),
      StringValidator.validate(`${this.path}.endpoint`, supplier?.endpoint),

      ...this.validateContact(supplier),
    ].flatMap((v) => (v ? [v] : []));
  };

  private validateContact = (supplier: Supplier | null): ValidatorError[] =>
    [
      StringValidator.validate(
        `${this.path}.contact.website`,
        supplier?.contact?.website,
        { nullable: true }
      ),
      StringValidator.validate(
        `${this.path}.contact.email`,
        supplier?.contact?.email,
        { nullable: true }
      ),
      StringValidator.validate(
        `${this.path}.contact.telephone`,
        supplier?.contact?.telephone,
        { nullable: true }
      ),
      StringValidator.validate(
        `${this.path}.contact.address`,
        supplier?.contact?.address,
        { nullable: true }
      ),
      ...this.validateContentCapability(supplier),
    ].flatMap((v) => (v ? [v] : []));

  private validateContentCapability = (
    supplier: Supplier | null
  ): ValidatorError[] => {
    if (this.capabilities.includes(CapabilityId.Content)) {
      return this.contentValidator.validate(supplier);
    }
    return [];
  };
}
