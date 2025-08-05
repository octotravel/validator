import { Contact } from '@octocloud/types';
import { ModelValidator, StringArrayValidator, StringValidator, ValidatorError } from '../ValidatorHelpers';

export class ContactValidator implements ModelValidator {
  private readonly path: string;
  private readonly shouldNotHydrate: boolean;
  public constructor({ path, shouldNotHydrate = false }: { path: string; shouldNotHydrate?: boolean }) {
    this.path = `${path}.contact`;
    this.shouldNotHydrate = shouldNotHydrate;
  }

  public validate = (contact?: Contact): ValidatorError[] => {
    const shouldWarn = this.shouldNotHydrate;
    return [
      StringValidator.validate(`${this.path}.fullName`, contact?.fullName, {
        nullable: true,
      }),
      StringValidator.validate(`${this.path}.firstName`, contact?.firstName, {
        nullable: true,
      }),
      StringValidator.validate(`${this.path}.lastName`, contact?.lastName, {
        nullable: true,
      }),
      StringValidator.validate(`${this.path}.emailAddress`, contact?.emailAddress, { nullable: true }),
      StringValidator.validate(`${this.path}.phoneNumber`, contact?.phoneNumber, {
        nullable: true,
      }),
      StringArrayValidator.validate(`${this.path}.locales`, contact?.locales, { shouldWarn }),
      StringValidator.validate(`${this.path}.country`, contact?.country, {
        nullable: true,
      }),
      StringValidator.validate(`${this.path}.notes`, contact?.notes, {
        nullable: true,
      }),
    ].flatMap((v) => (v ? [v] : []));
  };
}
