import {
  BookingCancellationBody,
  BookingCancellationPathParams,
  BookingConfirmationBody,
  BookingConfirmationPathParams,
  BookingReservationBody,
  BookingUpdateBody,
  BookingUpdatePathParams,
  cancelBookingBodySchema,
  cancelBookingPathParamsSchema,
  confirmBookingBodySchema,
  confirmBookingPathParamsSchema,
  createBookingBodySchema,
  ExtendReservationBody,
  ExtendReservationPathParams,
  extendBookingBodySchema,
  extendBookingPathParamsSchema,
  GetBookingsQueryParams,
  updateBookingBodySchema,
  updateBookingPathParamsSchema,
} from '@octocloud/types';
import * as yup from 'yup';

export interface GetBookingSchema {
  uuid: string;
}

export const getBookingSchema: yup.SchemaOf<GetBookingSchema> = yup.object().shape({
  uuid: yup.string().required(),
});

export interface GetBookingsSchema extends GetBookingsQueryParams {}

export const getBookingsSchema: yup.SchemaOf<GetBookingsSchema> = yup.object().shape({
  resellerReference: yup.string().optional(),
  supplierReference: yup.string().optional(),
});

export interface CreateBookingSchema extends BookingReservationBody {}

export const createBookingSchema = createBookingBodySchema.clone();

export interface ConfirmBookingSchema extends BookingConfirmationPathParams, BookingConfirmationBody {}

export const confirmBookingSchema: yup.SchemaOf<ConfirmBookingSchema> = yup.object().shape({
  ...confirmBookingPathParamsSchema.fields,
  ...confirmBookingBodySchema.fields,
});

export interface UpdateBookingSchema extends BookingUpdatePathParams, BookingUpdateBody {}

export const updateBookingSchema: yup.SchemaOf<UpdateBookingSchema> = yup.object().shape({
  ...updateBookingPathParamsSchema.fields,
  ...updateBookingBodySchema.fields,
});

export interface CancelBookingSchema extends BookingCancellationPathParams, BookingCancellationBody {}

export const cancelBookingSchema: yup.SchemaOf<CancelBookingSchema> = yup.object().shape({
  ...cancelBookingBodySchema.fields,
  ...cancelBookingPathParamsSchema.fields,
});

export interface ExtendBookingSchema extends ExtendReservationBody, ExtendReservationPathParams {}

export const extendBookingSchema: yup.SchemaOf<ExtendBookingSchema> = yup.object().shape({
  ...extendBookingBodySchema.fields,
  ...extendBookingPathParamsSchema.fields,
});
