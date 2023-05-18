import {
  Availability,
  AvailabilityBodySchema,
  AvailabilityCalendar,
  AvailabilityCalendarBodySchema,
  Booking,
  CancelBookingBodySchema,
  CancelBookingPathParamsSchema,
  Capability,
  CapabilityId,
  ConfirmBookingBodySchema,
  ConfirmBookingPathParamsSchema,
  ExtendBookingBodySchema,
  ExtendBookingPathParamsSchema,
  GetBookingPathParamsSchema,
  GetBookingsQueryParamsSchema,
  GetProductPathParamsSchema,
  Product,
  Supplier,
  UpdateBookingBodySchema,
  UpdateBookingPathParamsSchema,
} from "@octocloud/types";
import { CreateBookingSchema } from "../../../schemas/Booking";
import { Context } from "../context/Context";
import { Client } from "./Client";
import { Result } from "./types";

export class ApiClient extends Client {
  private url: string;
  constructor(data: {
    capabilities?: CapabilityId[];
    url: string;
    apiKey: string;
  }) {
    super(data);
    this.url = data.url;
  }

  public getCapabilities = async (context: Context): Promise<Result<Capability[]>> => {
    const url = `${this.url}/capabilities`;

    return this.fetch({ url, context });
  };

  public getSupplier = async (context: Context): Promise<Result<Supplier>> => {
    const url = `${this.url}/supplier`;
    return this.fetch({ url, context });
  };

  public getProducts = async (context: Context): Promise<Result<Product[]>> => {
    const url = `${this.url}/products`;
    return this.fetch({ url, context });
  };

  public getProduct = async (
    data: GetProductPathParamsSchema,
    context: Context
  ): Promise<Result<Product>> => {
    const url = `${this.url}/products/${data.id}`;
    return this.fetch({ url, context });
  };

  public getAvailability = async (
    data: AvailabilityBodySchema,
    context: Context
  ): Promise<Result<Availability[]>> => {
    const url = `${this.url}/availability`;
    const body = JSON.stringify(data);
    return this.fetch({ url, body, method: "POST", context });
  };

  public getAvailabilityCalendar = async (
    data: AvailabilityCalendarBodySchema,
    context: Context
  ): Promise<Result<AvailabilityCalendar[]>> => {
    const url = `${this.url}/availability/calendar`;
    const body = JSON.stringify(data);
    return this.fetch({ url, body, method: "POST", context });
  };

  public bookingReservation = async (
    data: CreateBookingSchema,
    context: Context
  ): Promise<Result<Booking>> => {
    const url = `${this.url}/bookings`;
    const body = JSON.stringify(data);
    return this.fetch({ url, body, method: "POST", context });
  };

  public bookingConfirmation = async (
    data: ConfirmBookingBodySchema & ConfirmBookingPathParamsSchema,
    context: Context
  ): Promise<Result<Booking>> => {
    const url = `${this.url}/bookings/${data.uuid}/confirm`;
    const { uuid, ...rest} = data
    const body = JSON.stringify(rest);
    return this.fetch({ url, body, method: "POST", context });
  };

  public getBookings = async (
    data: GetBookingsQueryParamsSchema,
    context: Context
  ): Promise<Result<Booking[]>> => {
    const params = new URLSearchParams(data);
    const url = `${this.url}/bookings?` + params;
    return this.fetch({ url, context});
  };

  public getBooking = async (
    data: GetBookingPathParamsSchema,
    context: Context
  ): Promise<Result<Booking>> => {
    const url = `${this.url}/bookings/${data.uuid}`;
    return this.fetch({ url, context});
  };

  public cancelBooking = async (
    data: CancelBookingBodySchema & CancelBookingPathParamsSchema,
    context: Context
  ): Promise<Result<Booking>> => {
    const url = `${this.url}/bookings/${data.uuid}`;
    const { uuid, ...rest} = data
    const body = JSON.stringify(rest);
    return this.fetch({ url, body, method: "DELETE", context });
  };

  public bookingExtend = async (
    data: ExtendBookingBodySchema & ExtendBookingPathParamsSchema,
    context: Context
  ): Promise<Result<Booking>> => {
    const url = `${this.url}/bookings/${data.uuid}/extend`;
    const { uuid, ...rest} = data
    const body = JSON.stringify(rest);
    return this.fetch({ url, body, method: "POST", context });
  };

  public bookingUpdate = async (
    data: UpdateBookingBodySchema & UpdateBookingPathParamsSchema,
    context: Context
  ): Promise<Result<Booking>> => {
    const url = `${this.url}/bookings/${data.uuid}`;
    /* tslint:disable-next-line  @typescript-eslint/no-unused-vars */
    const { uuid, ...rest} = data
    const body = JSON.stringify(rest);
    return this.fetch({ url, body, method: "PATCH", context });
  };
}
