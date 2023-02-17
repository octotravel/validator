import { RedemptionMethod, DeliveryFormat, Ticket } from "https://esm.sh/@octocloud/types@1.4.8";
import {
  StringValidator,
  EnumValidator,
  NullValidator,
  ModelValidator,
  ValidatorError,
} from "../ValidatorHelpers.ts";

export class TicketValidator implements ModelValidator {
  private path: string;
  constructor({ path }: { path: string }) {
    this.path = path;
  }
  public validate = (ticket?: Ticket | null): ValidatorError[] => {
    const errors = [
      EnumValidator.validate(
        `${this.path}.redemptionMethod`,
        ticket?.redemptionMethod,
        Object.values(RedemptionMethod)
      ),
      NullValidator.validate(
        `${this.path}.utcRedeemedAt`,
        ticket?.utcRedeemedAt
      ),
      ...this.validateDeliveryOptions(ticket),
    ];

    return errors.flatMap((v) => (v ? [v] : []));
  };
  private validateDeliveryOptions = (ticket?: Ticket | null): ValidatorError[] => {
    const deliveryOptions = ticket?.deliveryOptions ?? [];
    return deliveryOptions
      .map((deliveryOption, i) => [
        EnumValidator.validate(
          `${this.path}.deliveryOptions[${i}].deliveryFormat`,
          deliveryOption?.deliveryFormat,
          Object.values(DeliveryFormat)
        ),
        StringValidator.validate(
          `${this.path}.deliveryOptions[${i}].deliveryValue`,
          deliveryOption?.deliveryValue
        ),
      ])
      .flat(1)
      .flatMap((v) => (v ? [v] : []));
  };
}
