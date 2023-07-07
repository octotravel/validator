import { CancelBookingBodySchema, CancelBookingPathParamsSchema, ConfirmBookingBodySchema, ConfirmBookingPathParamsSchema, CreateBookingBodySchema, ExtendBookingBodySchema, ExtendBookingPathParamsSchema, GetBookingPathParamsSchema, GetBookingsQueryParamsSchema, UpdateBookingBodySchema, UpdateBookingPathParamsSchema, cancelBookingBodySchema, cancelBookingPathParamsSchema, confirmBookingBodySchema, confirmBookingPathParamsSchema, createBookingBodySchema, extendBookingBodySchema, extendBookingPathParamsSchema, getBookingPathParamsSchema, getBookingsQueryParamsSchema, updateBookingBodySchema, updateBookingPathParamsSchema } from '@octocloud/types';
import * as yup from 'yup';

export interface GetBookingSchema extends GetBookingPathParamsSchema {}

export const getBookingSchema: yup.SchemaOf<GetBookingSchema> =
  getBookingPathParamsSchema.clone();

export interface GetBookingsSchema extends GetBookingsQueryParamsSchema {}

export const getBookingsSchema: yup.SchemaOf<GetBookingsSchema> =
  getBookingsQueryParamsSchema.clone();

export interface CreateBookingSchema extends CreateBookingBodySchema {}

export const createBookingSchema = createBookingBodySchema.clone();

export interface ConfirmBookingSchema
  extends ConfirmBookingPathParamsSchema,
    ConfirmBookingBodySchema {}

export const confirmBookingSchema: yup.SchemaOf<ConfirmBookingSchema> = yup
  .object()
  .shape({
    ...confirmBookingPathParamsSchema.fields,
    ...confirmBookingBodySchema.fields,
  });

export interface UpdateBookingSchema
  extends UpdateBookingBodySchema,
    UpdateBookingPathParamsSchema {}

export const updateBookingSchema: yup.SchemaOf<UpdateBookingSchema> = yup
  .object()
  .shape({
    ...updateBookingPathParamsSchema.fields,
    ...updateBookingBodySchema.fields,
  });

export interface CancelBookingSchema
  extends CancelBookingBodySchema,
    CancelBookingPathParamsSchema {}

export const cancelBookingSchema: yup.SchemaOf<CancelBookingSchema> = yup
  .object()
  .shape({
    ...cancelBookingBodySchema.fields,
    ...cancelBookingPathParamsSchema.fields,
  });

export interface ExtendBookingSchema
  extends ExtendBookingBodySchema,
    ExtendBookingPathParamsSchema {}

export const extendBookingSchema: yup.SchemaOf<ExtendBookingSchema> = yup
  .object()
  .shape({
    ...extendBookingBodySchema.fields,
    ...extendBookingPathParamsSchema.fields,
  });
