import {
  Availability,
  AvailabilityCalendar,
  AvailabilityCalendarBody,
  AvailabilityCheckBody,
  Booking,
  Capability,
  CapabilityId,
  GetProductPathParams,
  Product,
  Supplier,
} from '@octocloud/types';
import {
  CancelBookingSchema,
  ConfirmBookingSchema,
  CreateBookingSchema,
  ExtendBookingSchema,
  GetBookingSchema,
  GetBookingsSchema,
  UpdateBookingSchema,
} from '../../../schemas/Booking';
import { Context } from '../context/Context';
import { Client } from './Client';
import { Result } from './types';

export class ApiClient extends Client {
  private readonly url: string;
  public constructor(data: { capabilities?: CapabilityId[]; url: string; headers: Record<string, string> }) {
    super(data);
    this.url = data.url;
  }

  public getCapabilities = async (context: Context): Promise<Result<Capability[]>> => {
    const url = `${this.url}/capabilities`;

    return await this.fetch({ url, context });
  };

  public getSupplier = async (context: Context): Promise<Result<Supplier>> => {
    const url = `${this.url}/supplier`;
    return await this.fetch({ url, context });
  };

  public getProducts = async (context: Context): Promise<Result<Product[]>> => {
    const url = `${this.url}/products`;
    return await this.fetch({ url, context });
  };

  public getProduct = async (data: GetProductPathParams, context: Context): Promise<Result<Product>> => {
    const url = `${this.url}/products/${data.id}`;
    return await this.fetch({ url, context });
  };

  public getAvailability = async (data: AvailabilityCheckBody, context: Context): Promise<Result<Availability[]>> => {
    const url = `${this.url}/availability`;
    const body = JSON.stringify(data);
    return await this.fetch({ url, body, method: 'POST', context });
  };

  public getAvailabilityCalendar = async (
    data: AvailabilityCalendarBody,
    context: Context,
  ): Promise<Result<AvailabilityCalendar[]>> => {
    const url = `${this.url}/availability/calendar`;
    const body = JSON.stringify(data);
    return await this.fetch({ url, body, method: 'POST', context });
  };

  public bookingReservation = async (data: CreateBookingSchema, context: Context): Promise<Result<Booking>> => {
    const url = `${this.url}/bookings`;
    const body = JSON.stringify(data);
    return await this.fetch({ url, body, method: 'POST', context });
  };

  public bookingConfirmation = async (data: ConfirmBookingSchema, context: Context): Promise<Result<Booking>> => {
    const url = `${this.url}/bookings/${data.uuid}/confirm`;
    const { uuid, ...rest } = data;
    const body = JSON.stringify(rest);
    return await this.fetch({ url, body, method: 'POST', context });
  };

  public getBookings = async (data: GetBookingsSchema, context: Context): Promise<Result<Booking[]>> => {
    const queryParams = new URLSearchParams();

    Object.keys(data).forEach((key) => {
      const value = data[key as keyof GetBookingsSchema];

      if (value) {
        queryParams.append(key, value);
      }
    });

    const url = `${this.url}/bookings?${queryParams.toString()}`;
    return await this.fetch({ url, context });
  };

  public getBooking = async (data: GetBookingSchema, context: Context): Promise<Result<Booking>> => {
    const url = `${this.url}/bookings/${data.uuid}`;
    return await this.fetch({ url, context });
  };

  public cancelBooking = async (data: CancelBookingSchema, context: Context): Promise<Result<Booking>> => {
    const url = `${this.url}/bookings/${data.uuid}/cancel`;
    const { uuid, ...rest } = data;
    const body = JSON.stringify(rest);
    return await this.fetch({ url, body, method: 'POST', context });
  };

  public bookingExtend = async (data: ExtendBookingSchema, context: Context): Promise<Result<Booking>> => {
    const url = `${this.url}/bookings/${data.uuid}/extend`;
    const { uuid, ...rest } = data;
    const body = JSON.stringify(rest);
    return await this.fetch({ url, body, method: 'POST', context });
  };

  public bookingUpdate = async (data: UpdateBookingSchema, context: Context): Promise<Result<Booking>> => {
    const url = `${this.url}/bookings/${data.uuid}`;
    const { uuid, ...rest } = data;
    const body = JSON.stringify(rest);
    return await this.fetch({ url, body, method: 'PATCH', context });
  };
}
