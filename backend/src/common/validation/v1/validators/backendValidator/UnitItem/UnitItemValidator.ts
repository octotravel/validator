import { BookingStatus, CapabilityId, DeliveryMethod, PricingPer, Ticket, UnitItem } from '@octocloud/types';
import { UnitValidator } from '../Unit/UnitValidator';

import { CommonValidator } from '../CommonValidator';
import { ContactValidator } from '../Contact/ContactValidator';
import { PricingValidator } from '../Pricing/PricingValidator';
import { TicketValidator } from '../Ticket/TicketValidator';
import { EnumValidator, ModelValidator, NullValidator, StringValidator, ValidatorError } from '../ValidatorHelpers';

export class UnitItemValidator implements ModelValidator {
  private readonly path: string;
  private readonly capabilities: CapabilityId[];
  private readonly unitValidator: UnitValidator;
  private readonly ticketValidator: TicketValidator;
  private readonly contactValidator: ContactValidator;
  private readonly isBooking: boolean;
  public constructor({
    path,
    capabilities,
    shouldNotHydrate = false,
    isBooking = false,
  }: {
    path: string;
    capabilities: CapabilityId[];
    shouldNotHydrate?: boolean;
    isBooking?: boolean;
  }) {
    this.path = path;
    this.capabilities = capabilities;
    this.unitValidator = new UnitValidator({ path: `${this.path}.unit`, capabilities, shouldNotHydrate });
    this.contactValidator = new ContactValidator({ path: this.path, shouldNotHydrate });
    this.ticketValidator = new TicketValidator({ path: `${this.path}.ticket` });
    this.isBooking = isBooking;
  }

  public validate = (
    unitItem: UnitItem,
    deliveryMethods?: DeliveryMethod[],
    pricingPer?: PricingPer,
  ): ValidatorError[] => {
    const shouldWarn = Boolean(unitItem?.uuid);
    const errors = [
      CommonValidator.validateUuid(`${this.path}.uuid`, unitItem?.uuid),
      StringValidator.validate(`${this.path}.resellerReference`, unitItem?.uuid, {
        nullable: true,
        shouldWarn,
      }),
      StringValidator.validate(`${this.path}.supplierReference`, unitItem?.uuid, {
        nullable: true,
        shouldWarn,
      }),
      StringValidator.validate(`${this.path}.unitId`, unitItem?.unitId, { shouldWarn }),
      ...(this.isBooking && !unitItem.unit ? [] : this.unitValidator.validate(unitItem?.unit!, pricingPer)),
      EnumValidator.validate(`${this.path}.status`, unitItem?.status, Object.values(BookingStatus), { shouldWarn }),
      NullValidator.validate(`${this.path}.utcRedeemedAt`, unitItem?.utcRedeemedAt),
      ...this.contactValidator.validate(unitItem?.contact),

      ...this.validatePricingCapability(unitItem, pricingPer),
      ...this.validateTicket(deliveryMethods ?? [], unitItem?.ticket),
    ];
    return errors.flatMap((v) => (v ? [v] : []));
  };

  private readonly validateTicket = (deliveryMethods: DeliveryMethod[], ticket?: Ticket | null): ValidatorError[] => {
    if (deliveryMethods.includes(DeliveryMethod.TICKET)) {
      return this.ticketValidator.validate(ticket);
    }

    return [NullValidator.validate(`${this.path}.ticket`, ticket)].flatMap((v) => (v ? [v] : []));
  };

  private readonly validatePricingCapability = (unitItem: UnitItem, pricingPer?: PricingPer): ValidatorError[] => {
    if (this.capabilities.includes(CapabilityId.Pricing) && pricingPer === PricingPer.UNIT) {
      const pricingValidator = new PricingValidator(`${this.path}.pricing`);
      return pricingValidator.validate(unitItem?.pricing);
    }
    return [];
  };
}
