import { CapabilityId, Supplier } from '@octocloud/types';
import { ModelValidator, StringValidator, ValidatorError } from '../ValidatorHelpers';
import { SupplierContentValidator } from './SupplierContentValidator';

export class SupplierValidator implements ModelValidator {
  private readonly path: string;
  private readonly capabilities: CapabilityId[];
  private readonly contentValidator: SupplierContentValidator;

  public constructor({ path = '', capabilities }: { path?: string; capabilities: CapabilityId[] }) {
    this.path = path ? `${path}supplier` : 'supplier';
    this.capabilities = capabilities;
    this.contentValidator = new SupplierContentValidator({ path: this.path });
  }

  public validate = (supplier: Supplier | null): ValidatorError[] => {
    return [
      StringValidator.validate(`${this.path}.id`, supplier?.id),
      StringValidator.validate(`${this.path}.name`, supplier?.name),
      StringValidator.validate(`${this.path}.endpoint`, supplier?.endpoint),

      ...this.validateContact(supplier),
      ...this.validateContentCapability(supplier),
    ].flatMap((v) => (v ? [v] : []));
  };

  private readonly validateContact = (supplier: Supplier | null): ValidatorError[] =>
    [
      StringValidator.validate(`${this.path}.contact.website`, supplier?.contact?.website, { nullable: true }),
      StringValidator.validate(`${this.path}.contact.email`, supplier?.contact?.email, { nullable: true }),
      StringValidator.validate(`${this.path}.contact.telephone`, supplier?.contact?.telephone, { nullable: true }),
      StringValidator.validate(`${this.path}.contact.address`, supplier?.contact?.address, { nullable: true }),
    ].flatMap((v) => (v ? [v] : []));

  private readonly validateContentCapability = (supplier: Supplier | null): ValidatorError[] => {
    if (this.capabilities.includes(CapabilityId.OCTO_CONTENT)) {
      return this.contentValidator.validate(supplier);
    }
    return [];
  };
}
