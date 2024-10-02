import { BookingReservationScenario } from '../../Scenarios/Booking/Reservation/BookingReservationScenario';
import { Flow, FlowResult } from '../Flow';
import { BookingReservationInvalidProductScenario } from '../../Scenarios/Booking/Reservation/BookingReservationInvalidProductScenario';
import { BookingReservationInvalidOptionScenario } from '../../Scenarios/Booking/Reservation/BookingReservationInvalidOptionScenario';
import { BookingReservationInvalidAvailabilityIdScenario } from '../../Scenarios/Booking/Reservation/BookingReservationInvalidAvailabilityIdScenario';
import { BaseFlow } from '../BaseFlow';
import { BookingReservationSoldOutScenario } from '../../Scenarios/Booking/Reservation/BookingReservationSoldOutScenario';
import { BookingReservationMissingUnitItemsScenario } from '../../Scenarios/Booking/Reservation/BookingReservationMissingUnitItemsScenario';
import { BookingReservationEmptyUnitItemsScenario } from '../../Scenarios/Booking/Reservation/BookingReservationEmptyUnitItemsScenario';
import { BookingReservationInvalidUnitIdScenario } from '../../Scenarios/Booking/Reservation/BookingReservationInvalidUnitIdScenario';
import { Scenario } from '../../Scenarios/Scenario';
import { Booker } from '../../Booker';
import docs from '../../consts/docs';
import { Context } from '../../context/Context';
import { LogicError } from '@octocloud/core';

export class BookingReservationFlow extends BaseFlow implements Flow {
  private readonly booker = new Booker();
  public constructor() {
    super('Booking Reservation', docs.bookingReservation);
  }

  public validate = async (context: Context): Promise<FlowResult> => {
    const scenarios = [await this.reserveAvailableProduct(context)];

    if (context.productConfig.validateSoldOutProduct) {
      scenarios.push(await this.reserveSoldOutProduct(context));
    }

    scenarios.push(
      await this.reserveInvalidProduct(context),
      await this.reserveInvalidOption(context),
      await this.reserveInvalidAvailabilityID(context),
      await this.reserveWithMissingUnitItems(context),
      await this.reserveWithEmptyUnitItems(context),
      await this.validateBookingInvalidUnitId(context),
    );

    return await this.validateScenarios(scenarios, context);
  };

  private readonly reserveAvailableProduct = async (context: Context): Promise<Scenario> => {
    const [bookableProduct] = context.productConfig.availableProducts;

    const result = await this.booker.createReservation(bookableProduct, context);

    return new BookingReservationScenario({ result });
  };

  private readonly reserveSoldOutProduct = async (context: Context): Promise<Scenario> => {
    const bookableProduct = context.productConfig.soldOutProduct;

    if (context.productConfig.soldOutProduct === null) {
      throw new LogicError('Sold out product not found');
    }

    const result = await this.booker.createReservation(bookableProduct!, context, {
      soldOutAvailability: true,
    });

    return new BookingReservationSoldOutScenario({ result });
  };

  private readonly reserveInvalidProduct = async (context: Context): Promise<Scenario> => {
    const [bookableProduct] = context.productConfig.availableProducts;

    const result = await this.booker.createReservation(bookableProduct, context, {
      invalidProductId: true,
    });

    return new BookingReservationInvalidProductScenario({ result });
  };

  private readonly reserveInvalidOption = async (context: Context): Promise<Scenario> => {
    const [bookableProduct] = context.productConfig.availableProducts;

    const result = await this.booker.createReservation(bookableProduct, context, {
      invalidOptionId: true,
    });

    return new BookingReservationInvalidOptionScenario({
      result,
    });
  };

  private readonly reserveInvalidAvailabilityID = async (context: Context): Promise<Scenario> => {
    const [bookableProduct] = context.productConfig.availableProducts;

    const result = await this.booker.createReservation(bookableProduct, context, {
      invalidAvailabilityId: true,
    });

    return new BookingReservationInvalidAvailabilityIdScenario({
      result,
    });
  };

  private readonly reserveWithMissingUnitItems = async (context: Context): Promise<Scenario> => {
    const [bookableProduct] = context.productConfig.availableProducts;

    const result = await this.booker.createReservation(bookableProduct, context, {
      unitItemsMissing: true,
    });

    return new BookingReservationMissingUnitItemsScenario({
      result,
    });
  };

  private readonly reserveWithEmptyUnitItems = async (context: Context): Promise<Scenario> => {
    const [bookableProduct] = context.productConfig.availableProducts;

    const result = await this.booker.createReservation(bookableProduct, context, {
      unitItemsEmpty: true,
    });

    return new BookingReservationEmptyUnitItemsScenario({ result });
  };

  private readonly validateBookingInvalidUnitId = async (context: Context): Promise<Scenario> => {
    const [bookableProduct] = context.productConfig.availableProducts;

    const result = await this.booker.createReservation(bookableProduct, context, {
      invalidUnitItems: true,
    });

    return new BookingReservationInvalidUnitIdScenario({
      result,
    });
  };
}
