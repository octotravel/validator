import { IRequest, Router, json } from 'itty-router';
import { inject, singleton } from 'tsyringe';
import { GetSupplierHandler } from './supplier/GetSupplierHandler';
import { AuthMiddleware } from './AuthMiddleware';
import { GetProductsHandler } from './product/GetProductsHandler';
import { GetProductHandler } from './product/GetProductHandler';
import { AvailabilityCalendarHandler } from './availability/AvailabilityCalendarHandler';
import { RequestLoggerMiddleware } from './RequestLoggerMiddleware';
import { AvailabilityCheckHandler } from './availability/AvailabilityCheckHandler';
import { BookingReservationHandler } from './booking/BookingReservationHandler';

@singleton()
export class OctoRouter {
  public readonly router;

  public constructor(
    @inject(AuthMiddleware) private readonly authMiddleware: AuthMiddleware,
    @inject(RequestLoggerMiddleware) private readonly requestLoggerMiddleware: RequestLoggerMiddleware,
    @inject(GetSupplierHandler) private readonly getSupplierHandler: GetSupplierHandler,
    @inject(GetProductsHandler) private readonly getProductsHandler: GetProductsHandler,
    @inject(GetProductHandler) private readonly getProductHandler: GetProductsHandler,
    @inject(AvailabilityCalendarHandler) private readonly availabilityCalendarHandler: AvailabilityCalendarHandler,
    @inject(AvailabilityCheckHandler) private readonly availabilityCheckHandler: AvailabilityCheckHandler,
    @inject(BookingReservationHandler) private readonly bookingReservationHandler: BookingReservationHandler,
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
  }
}
