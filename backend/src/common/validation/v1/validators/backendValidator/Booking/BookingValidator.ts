import { TicketValidator } from './../Ticket/TicketValidator';
import { CapabilityId, Booking, BookingStatus, DeliveryMethod } from '@octocloud/types';
import { BookingStateValidator } from './BookingState/BookingStateValidator';
import { OptionValidator } from '../Option/OptionValidator';
import { ProductValidator } from '../Product/ProductValidator';
import {
  BooleanValidator,
  EnumArrayValidator,
  EnumValidator,
  ModelValidator,
  NullValidator,
  StringValidator,
  ValidatorError,
} from '../ValidatorHelpers';
import { ContactValidator } from '../Contact/ContactValidator';
import { UnitItemValidator } from '../UnitItem/UnitItemValidator';
import { PricingValidator } from '../Pricing/PricingValidator';
import { CommonValidator } from '../CommonValidator';
import { BookingPickupValidator } from './BookingPickupValidator';

// TODO: add support for validating pricing
// TODO: add support for validating delivery method related things

export class BookingValidator implements ModelValidator {
  private readonly path: string;
  private readonly productValidator: ProductValidator;
  private readonly optionValidator: OptionValidator;
  private readonly bookingStateValidator: BookingStateValidator;
  private readonly contactValidator: ContactValidator;
  private readonly ticketValidator: TicketValidator;
  private readonly pricingValidator: PricingValidator;
  private readonly pickupValidator: BookingPickupValidator;
  private readonly capabilities: CapabilityId[];
  private readonly shouldNotHydrate: boolean;

  public constructor({
    capabilities,
    shouldNotHydrate = false,
  }: {
    capabilities: CapabilityId[];
    shouldNotHydrate?: boolean;
  }) {
    this.path = 'booking';
    this.capabilities = capabilities;
    this.shouldNotHydrate = shouldNotHydrate;
    this.productValidator = new ProductValidator({
      path: `${this.path}.product`,
      capabilities: this.capabilities,
      shouldNotHydrate,
    });
    this.optionValidator = new OptionValidator({
      path: `${this.path}.option`,
      capabilities: this.capabilities,
      shouldNotHydrate,
    });
    this.bookingStateValidator = new BookingStateValidator({ path: this.path });
    this.contactValidator = new ContactValidator({ path: this.path });
    this.ticketValidator = new TicketValidator({
      path: `${this.path}.voucher`,
    });
    this.pricingValidator = new PricingValidator(`${this.path}.pricing`);
    this.pickupValidator = new BookingPickupValidator({ path: this.path });
  }

  public validate = (booking: Booking | null): ValidatorError[] => {
    return [
      StringValidator.validate(`${this.path}.id`, booking?.id),
      CommonValidator.validateUuid(`${this.path}.uuid`, booking?.uuid),
      BooleanValidator.validate(`${this.path}.testMode`, booking?.testMode),
      StringValidator.validate(`${this.path}.resellerReference`, booking?.resellerReference, { nullable: true }),
      StringValidator.validate(`${this.path}.supplierReference`, booking?.supplierReference, { nullable: true }),
      EnumValidator.validate(`${this.path}.status`, booking?.status, Object.values(BookingStatus)),
      ...this.bookingStateValidator.validate(booking),
      StringValidator.validate(`${this.path}.productId`, booking?.productId),
      ...(booking?.product ? this.productValidator.validate(booking?.product) : []),
      StringValidator.validate(`${this.path}.optionId`, booking?.optionId),
      ...(booking?.option ? this.optionValidator.validate(booking?.option, booking?.product?.availabilityType) : []),
      BooleanValidator.validate(`${this.path}.cancellable`, booking?.cancellable),
      BooleanValidator.validate(`${this.path}.freesale`, booking?.freesale),
      ...this.validateBookingAvailability(booking),
      ...this.contactValidator.validate(booking?.contact),
      StringValidator.validate(`${this.path}.notes`, booking?.notes, {
        nullable: true,
      }),
      ...(booking?.product ? this.validateDeliveryMethods(booking) : []),
      ...this.validateUnitItems(booking),
      ...this.validateVoucher(booking),
      ...this.validatePricingCapability(booking),
      ...this.validatePickupCapability(booking),
    ].flatMap((v) => (v ? [v] : []));
  };

  private readonly validateVoucher = (booking: Booking | null): ValidatorError[] => {
    if ((booking?.deliveryMethods ?? []).includes(DeliveryMethod.VOUCHER)) {
      return this.ticketValidator.validate(booking?.voucher);
    }

    return [NullValidator.validate(`${this.path}.voucher`, booking?.voucher)].flatMap((v) => (v ? [v] : []));
  };

  private readonly validateDeliveryMethods = (booking: Booking | null): ValidatorError[] => {
    const path = `${this.path}.deliveryMethods`;
    const errors = new Array<ValidatorError>();
    const deliveryMethodsValidated = EnumArrayValidator.validate(
      path,
      booking?.deliveryMethods,
      Object.values(DeliveryMethod),
    );
    if (deliveryMethodsValidated) {
      errors.push(deliveryMethodsValidated);
    }

    const deliveryMethodsMatch =
      booking?.deliveryMethods?.every((method) => booking?.product?.deliveryMethods.includes(method)) &&
      booking?.deliveryMethods?.length === booking?.product?.deliveryMethods?.length;

    if (!deliveryMethodsMatch) {
      errors.push(
        new ValidatorError({
          message: `${path} does not match with ${this.path}.product.deliveryMethods`,
        }),
      );
    }
    return errors;
  };

  private readonly validateBookingAvailability = (booking: Booking | null): ValidatorError[] =>
    [
      StringValidator.validate(`${this.path}.availabilityId`, booking?.availabilityId),
      StringValidator.validate(`${this.path}.availability.id`, booking?.availability?.id),
      CommonValidator.validateLocalDateTime(
        `${this.path}.availability.localDateTimeStart`,
        booking?.availability?.localDateTimeStart,
      ),
      CommonValidator.validateLocalDateTime(
        `${this.path}.availability.localDateTimeEnd`,
        booking?.availability?.localDateTimeEnd,
      ),
      BooleanValidator.validate(`${this.path}.availability.allDay`, booking?.availability?.allDay),
      ...CommonValidator.validateOpeningHours(
        `${this.path}.availability`,
        booking?.availability?.openingHours ?? [],
        booking?.product?.availabilityType,
      ),
    ].flatMap((v) => (v ? [v] : []));

  private readonly validateUnitItems = (booking: Booking | null): ValidatorError[] => {
    const unitItems = booking?.unitItems ?? [];
    return unitItems
      .map((unitItem, i) => {
        const validator = new UnitItemValidator({
          path: `${this.path}.unitItems[${i}]`,
          capabilities: this.capabilities,
          shouldNotHydrate: this.shouldNotHydrate,
          isBooking: true,
        });
        return validator.validate(unitItem, booking?.deliveryMethods, booking?.product?.pricingPer);
      })
      .flat(1)
      .flatMap((v) => (v ? [v] : []));
  };

  private readonly validatePricingCapability = (booking: Booking | null): ValidatorError[] => {
    if (this.capabilities.includes(CapabilityId.Pricing)) {
      return this.pricingValidator.validate(booking?.pricing);
    }
    return [];
  };

  private readonly validatePickupCapability = (booking: Booking | null): ValidatorError[] => {
    if (this.capabilities.includes(CapabilityId.Pickups)) {
      return this.pickupValidator.validate(booking);
    }
    return [];
  };
}
