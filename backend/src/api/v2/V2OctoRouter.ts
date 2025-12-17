import { inject } from '@needle-di/core';
import { IRequest, Router } from 'itty-router';
import { AuthMiddleware } from '../reseller/reseller/octo/AuthMiddleware';
import { AvailabilityCalendarHandler } from '../reseller/reseller/octo/availability/AvailabilityCalendarHandler';
import { AvailabilityCheckHandler } from '../reseller/reseller/octo/availability/AvailabilityCheckHandler';
import { BookingCancellationHandler } from '../reseller/reseller/octo/booking/BookingCancellationHandler';
import { BookingConfirmationHandler } from '../reseller/reseller/octo/booking/BookingConfirmationHandler';
import { BookingReservationHandler } from '../reseller/reseller/octo/booking/BookingReservationHandler';
import { GetProductHandler } from '../reseller/reseller/octo/product/GetProductHandler';
import { GetProductsHandler } from '../reseller/reseller/octo/product/GetProductsHandler';
import { RequestLoggerMiddleware } from '../reseller/reseller/octo/RequestLoggerMiddleware';
import { GetSupplierHandler } from '../reseller/reseller/octo/supplier/GetSupplierHandler';
// test
export class V2OctoRouter {
  public readonly router;

  public constructor(
    private readonly authMiddleware = inject(AuthMiddleware),
    private readonly requestLoggerMiddleware = inject(RequestLoggerMiddleware),
    private readonly getSupplierHandler = inject(GetSupplierHandler),
    private readonly getProductsHandler = inject(GetProductsHandler),
    private readonly getProductHandler = inject(GetProductHandler),
    private readonly availabilityCalendarHandler = inject(AvailabilityCalendarHandler),
    private readonly availabilityCheckHandler = inject(AvailabilityCheckHandler),
    private readonly bookingReservationHandler = inject(BookingReservationHandler),
    private readonly bookingConfirmationHandler = inject(BookingConfirmationHandler),
    private readonly bookingCancellationHandler = inject(BookingCancellationHandler),
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
