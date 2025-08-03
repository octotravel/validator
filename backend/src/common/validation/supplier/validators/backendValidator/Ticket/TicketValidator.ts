import { DeliveryFormat, RedemptionMethod, Ticket } from '@octocloud/types';
import { EnumValidator, ModelValidator, NullValidator, StringValidator, ValidatorError } from '../ValidatorHelpers';

export class TicketValidator implements ModelValidator {
  private readonly path: string;
  public constructor({ path }: { path: string }) {
    this.path = path;
  }

  public validate = (ticket?: Ticket | null): ValidatorError[] => {
    const errors = [
      EnumValidator.validate(
        `${this.path}.redemptionMethod`,
        ticket?.redemptionMethod,
        Object.values(RedemptionMethod),
      ),
      NullValidator.validate(`${this.path}.utcRedeemedAt`, ticket?.utcRedeemedAt),
      ...this.validateDeliveryOptions(ticket),
    ];

    return errors.flatMap((v) => (v ? [v] : []));
  };

  private readonly validateDeliveryOptions = (ticket?: Ticket | null): ValidatorError[] => {
    const deliveryOptions = ticket?.deliveryOptions ?? [];
    return deliveryOptions
      .flatMap((deliveryOption, i) => [
        EnumValidator.validate(
          `${this.path}.deliveryOptions[${i}].deliveryFormat`,
          deliveryOption?.deliveryFormat,
          Object.values(DeliveryFormat),
        ),
        StringValidator.validate(`${this.path}.deliveryOptions[${i}].deliveryValue`, deliveryOption?.deliveryValue),
      ])
      .flatMap((v) => (v ? [v] : []));
  };
}
