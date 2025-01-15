import { IRequest, Router } from 'itty-router';

import { inject } from '@needle-di/core';
import { AuthMiddleware } from './AuthMiddleware';
import { RequestLoggerMiddleware } from './RequestLoggerMiddleware';
import { AvailabilityCalendarHandler } from './availability/AvailabilityCalendarHandler';
import { AvailabilityCheckHandler } from './availability/AvailabilityCheckHandler';
import { BookingCancellationHandler } from './booking/BookingCancellationHandler';
import { BookingConfirmationHandler } from './booking/BookingConfirmationHandler';
import { BookingReservationHandler } from './booking/BookingReservationHandler';
import { GetProductHandler } from './product/GetProductHandler';
import { GetProductsHandler } from './product/GetProductsHandler';
import { GetSupplierHandler } from './supplier/GetSupplierHandler';

export class OctoRouter {
  public readonly router;

  public constructor(
    private readonly authMiddleware: AuthMiddleware = inject(AuthMiddleware),
    private readonly requestLoggerMiddleware: RequestLoggerMiddleware = inject(RequestLoggerMiddleware),
    private readonly getSupplierHandler: GetSupplierHandler = inject(GetSupplierHandler),
    private readonly getProductsHandler: GetProductsHandler = inject(GetProductsHandler),
    private readonly getProductHandler: GetProductHandler = inject(GetProductHandler),
    private readonly availabilityCalendarHandler: AvailabilityCalendarHandler = inject(AvailabilityCalendarHandler),
    private readonly availabilityCheckHandler: AvailabilityCheckHandler = inject(AvailabilityCheckHandler),
    private readonly bookingReservationHandler: BookingReservationHandler = inject(BookingReservationHandler),
    private readonly bookingConfirmationHandler: BookingConfirmationHandler = inject(BookingConfirmationHandler),
    private readonly bookingCancellationHandler: BookingCancellationHandler = inject(BookingCancellationHandler),
  ) {
    const auth = async (req: IRequest): Promise<void> => {
      await this.authMiddleware.invoke(req);
    };

    const requestLogger = async (response: Response, request: IRequest): Promise<void> => {
      await this.requestLoggerMiddleware.invoke(response, request);
    };

    this.router = Router({
      base: '/v2/reseller/octo',
      before: [auth],
      finally: [requestLogger],
    });

    this.router.get('/supplier', async (request) => await this.getSupplierHandler.handleRequest(request));
    this.router.get('/products', async (request) => await this.getProductsHandler.handleRequest(request));
    this.router.get('/products/:productId', async (request) => await this.getProductHandler.handleRequest(request));
    this.router.post(
      '/availability/calendar',
      async (request) => await this.availabilityCalendarHandler.handleRequest(request),
    );
    this.router.post('/availability', async (request) => await this.availabilityCheckHandler.handleRequest(request));
    this.router.post('/bookings', async (request) => await this.bookingReservationHandler.handleRequest(request));
    this.router.post(
      '/bookings/:bookingUuid/confirm',
      async (request) => await this.bookingConfirmationHandler.handleRequest(request),
    );
    this.router.post(
      '/bookings/:bookingUuid/cancel',
      async (request) => await this.bookingCancellationHandler.handleRequest(request),
    );
  }
}
