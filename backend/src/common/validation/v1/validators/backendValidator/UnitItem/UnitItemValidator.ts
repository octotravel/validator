import { BookingStatus, CapabilityId, UnitItem, PricingPer, DeliveryMethod, Ticket } from '@octocloud/types';
import { UnitValidator } from '../Unit/UnitValidator';

import { StringValidator, EnumValidator, NullValidator, ModelValidator, ValidatorError } from '../ValidatorHelpers';
import { ContactValidator } from '../Contact/ContactValidator';
import { PricingValidator } from '../Pricing/PricingValidator';
import { TicketValidator } from '../Ticket/TicketValidator';

export class UnitItemValidator implements ModelValidator {
  private readonly path: string;
  private readonly capabilities: CapabilityId[];
  private readonly unitValidator: UnitValidator;
  private readonly ticketValidator: TicketValidator;
  private readonly contactValidator: ContactValidator;
  public constructor({
    path,
    capabilities,
    shouldNotHydrate = false,
  }: {
    path: string;
    capabilities: CapabilityId[];
    shouldNotHydrate?: boolean;
  }) {
    this.path = path;
    this.capabilities = capabilities;
    this.unitValidator = new UnitValidator({ path: `${this.path}.unit`, capabilities, shouldNotHydrate });
    this.contactValidator = new ContactValidator({ path: this.path, shouldNotHydrate });
    this.ticketValidator = new TicketValidator({ path: `${this.path}.ticket` });
  }

  public validate = (
    unitItem: UnitItem,
    deliveryMethods?: DeliveryMethod[],
    pricingPer?: PricingPer,
  ): ValidatorError[] => {
    const shouldWarn = Boolean(unitItem?.uuid);
    const errors = [
      StringValidator.validate(`${this.path}.uuid`, unitItem?.uuid),
      StringValidator.validate(`${this.path}.resellerReference`, unitItem?.uuid, {
        nullable: true,
        shouldWarn,
      }),
      StringValidator.validate(`${this.path}.supplierReference`, unitItem?.uuid, {
        nullable: true,
        shouldWarn,
      }),
      StringValidator.validate(`${this.path}.unitId`, unitItem?.unitId, { shouldWarn }),
      ...this.unitValidator.validate(unitItem?.unit!, pricingPer),
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
