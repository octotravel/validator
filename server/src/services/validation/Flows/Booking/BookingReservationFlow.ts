import { BookingReservationScenario } from "../../Scenarios/Booking/Reservation/BookingReservationScenario.ts";
import { Flow, FlowResult } from "../Flow.ts";
import { BookingReservationInvalidProductScenario } from "../../Scenarios/Booking/Reservation/BookingReservationInvalidProductScenario.ts";
import { BookingReservationInvalidOptionScenario } from "../../Scenarios/Booking/Reservation/BookingReservationInvalidOptionScenario.ts";
import { BookingReservationInvalidAvailabilityIdScenario } from "../../Scenarios/Booking/Reservation/BookingReservationInvalidAvailabilityIdScenario.ts";
import { BaseFlow } from "../BaseFlow.ts";
import { BookingReservationSoldOutScenario } from "../../Scenarios/Booking/Reservation/BookingReservationSoldOutScenario.ts";
import { BookingReservationMissingUnitItemsScenario } from "../../Scenarios/Booking/Reservation/BookingReservationMissingUnitItemsScenario.ts";
import { BookingReservationEmptyUnitItemsScenario } from "../../Scenarios/Booking/Reservation/BookingReservationEmptyUnitItemsScenario.ts";
import { BookingReservationInvalidUnitIdScenario } from "../../Scenarios/Booking/Reservation/BookingReservationInvalidUnitIdScenario.ts";
import { Scenario } from "../../Scenarios/Scenario.ts";
import { Booker } from "../../Booker.ts";
import docs from "../../consts/docs.ts";
import { Context } from "../../context/Context.ts";

export class BookingReservationFlow extends BaseFlow implements Flow {
  private booker = new Booker();
  constructor() {
    super("Booking Reservation", docs.bookingReservation);
  }
  
  public validate = async (context: Context): Promise<FlowResult> => {
    const scenarios = [
      await this.reserveAvailableProduct(context),
      await this.reserveSoldOutProduct(context),
      await this.reserveInvalidProduct(context),
      await this.reserveInvalidOption(context),
      await this.reserveInvalidAvailabilityID(context),
      await this.reserveWithMissingUnitItems(context),
      await this.reserveWithEmptyUnitItems(context),
      await this.validateBookingInvalidUnitId(context),
    ];
    return this.validateScenarios(scenarios, context);
  };

  private reserveAvailableProduct = async (context: Context): Promise<Scenario> => {
    const [bookableProduct] = context.productConfig.availableProducts;
    
    const result = await this.booker.createReservation(bookableProduct, context);
    
    return new BookingReservationScenario({ result });
  };

  private reserveSoldOutProduct = async (context: Context): Promise<Scenario> => {
    const bookableProduct = context.productConfig.soldOutProduct;
    
    const result = await this.booker.createReservation(bookableProduct,
      context,
       {
      soldOutAvailability: true,
    });
    
    return new BookingReservationSoldOutScenario({ result });
  };

  private reserveInvalidProduct = async (context: Context): Promise<Scenario> => {
    const [bookableProduct] = context.productConfig.availableProducts;
    
    const result = await this.booker.createReservation(bookableProduct,
      context,
        {
      invalidProductId: true,
    });
    
    return new BookingReservationInvalidProductScenario({ result });
  };

  private reserveInvalidOption = async (context: Context): Promise<Scenario> => {
    const [bookableProduct] = context.productConfig.availableProducts;
    
    const result = await this.booker.createReservation(bookableProduct,
      context,
        {
      invalidOptionId: true,
    });
    
    return new BookingReservationInvalidOptionScenario({
      result,
    });
  };

  private reserveInvalidAvailabilityID = async (context: Context): Promise<
    Scenario
  > => {
    const [bookableProduct] = context.productConfig.availableProducts;
    
    const result = await this.booker.createReservation(bookableProduct,
      context,
        {
      invalidAvailabilityId: true,
    });
    
    return new BookingReservationInvalidAvailabilityIdScenario({
      result,
    });
  };

  private reserveWithMissingUnitItems = async (context: Context): Promise<
    Scenario
  > => {
    const [bookableProduct] = context.productConfig.availableProducts;
    
    const result = await this.booker.createReservation(bookableProduct,
      context,
        {
      unitItemsMissing: true,
    });
    
    return new BookingReservationMissingUnitItemsScenario({
      result,
    });
  };

  private reserveWithEmptyUnitItems = async (context: Context): Promise<Scenario> => {
    const [bookableProduct] = context.productConfig.availableProducts;
    
    const result = await this.booker.createReservation(bookableProduct,
      context,
        {
      unitItemsEmpty: true,
    });
    
    return new BookingReservationEmptyUnitItemsScenario({ result });
  };

  private validateBookingInvalidUnitId = async (context: Context): Promise<
    Scenario
  > => {
    const [bookableProduct] = context.productConfig.availableProducts;
    
    const result = await this.booker.createReservation(bookableProduct,
      context,
        {
      invalidUnitItems: true,
    });

    

    return new BookingReservationInvalidUnitIdScenario({
      result,
    });
  };
}
