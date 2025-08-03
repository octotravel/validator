import { inject } from '@needle-di/core';
import { HttpError } from '@octocloud/core';
import { IRequest } from 'itty-router';
import { BookingFacade } from '../../../../../common/validation/reseller/facade/booking/BookingFacade';
import { SessionNotFoundError } from '../../../../../common/validation/reseller/session/error/SessionNotFoundError';
import { SessionScenarioNotSetError } from '../../../../../common/validation/reseller/session/error/SessionScenarioNotSetError';
import { SessionScenarioStepNotAllowedError } from '../../../../../common/validation/reseller/session/error/SessionScenarioStepNotAllowedError';
import { ValidationError } from '../../../../../common/validation/reseller/validator/error/ValidationError';
import { ErrorResponseFactory } from '../../../../http/error/ErrorResponseFactory';
import { JsonResponseFactory } from '../../../../http/json/JsonResponseFactory';
import { RequestHandler } from '../../../../http/request/RequestHandler';
import { BodyParser } from '../../../../util/BodyParser';

export class BookingReservationHandler implements RequestHandler {
  public constructor(
    private readonly jsonResponseFactory = inject(JsonResponseFactory),
    private readonly errorResponseFactory = inject(ErrorResponseFactory),
    private readonly bookingFacade = inject(BookingFacade),
  ) {}

  public async handleRequest(request: IRequest): Promise<Response> {
    const parsedBody = await BodyParser.parseBody(request);

    try {
      const booking = await this.bookingFacade.bookingReservation(parsedBody);

      return this.jsonResponseFactory.create(booking);
    } catch (e: unknown) {
      if (e instanceof SessionNotFoundError) {
        return this.errorResponseFactory.createNotFoundResponse(e.message, e);
      } else if (e instanceof SessionScenarioNotSetError) {
        return this.errorResponseFactory.createBadRequestResponse(e.message, e);
      } else if (e instanceof SessionScenarioStepNotAllowedError) {
        return this.errorResponseFactory.createForbiddenResponse(e.message, e);
      } else if (e instanceof ValidationError) {
        // TODO fix
        return this.errorResponseFactory.createValidationErrorResponse(e.validationResult, e);
      } else if (e instanceof HttpError) {
        // TODO fix
        // return this.errorResponseFactory.createErrorResponse(e.status, e.validationResult, e);
      }

      throw e;
    }
  }
}
