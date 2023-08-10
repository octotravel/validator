import { Contact } from "@octocloud/types";
import {
  ModelValidator,
  StringArrayValidator,
  StringValidator,
  ValidatorError,
} from "../ValidatorHelpers";

export class ContactValidator implements ModelValidator {
  private path: string;
  private shouldWarnOnNonHydrated: boolean;
  constructor({ path, shouldWarnOnNonHydrated = false, }: { path: string, shouldWarnOnNonHydrated?: boolean, }) {
    this.path = `${path}.contact`;
    this.shouldWarnOnNonHydrated = shouldWarnOnNonHydrated;
  }

  public validate = (contact?: Contact): ValidatorError[] => {
    const shouldWarn = this.shouldWarnOnNonHydrated;
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
      StringValidator.validate(
        `${this.path}.emailAddress`,
        contact?.emailAddress,
        { nullable: true }
      ),
      StringValidator.validate(
        `${this.path}.phoneNumber`,
        contact?.phoneNumber,
        {
          nullable: true,
        }
      ),
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
