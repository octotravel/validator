import { JsonResponseFactory } from '../../../../http/json/JsonResponseFactory';
import { RequestHandler } from '../../../../http/request/RequestHandler';
import { SessionNotFoundError } from '../../../../../common/validation/v2/session/error/SessionNotFoundError';
import { ErrorResponseFactory } from '../../../../http/error/ErrorResponseFactory';
import { SessionScenarioStepNotAllowedError } from '../../../../../common/validation/v2/session/error/SessionScenarioStepNotAllowedError';
import { SessionScenarioNotSetError } from '../../../../../common/validation/v2/session/error/SessionScenarioNotSetError';
import { AvailabilityFacade } from '../../../../../common/validation/v2/facade/availability/AvailabilityFacade';
import { BodyParser } from '../../../../util/BodyParser';
import { ValidationError } from '../../../../../common/validation/v2/validator/error/ValidationError';
import { HttpError } from '@octocloud/core';
import { inject } from '@needle-di/core';
import { IRequest } from 'itty-router';

export class AvailabilityCalendarHandler implements RequestHandler {
  public constructor(
    private readonly jsonResponseFactory: JsonResponseFactory = inject(JsonResponseFactory),
    private readonly errorResponseFactory: ErrorResponseFactory = inject(ErrorResponseFactory),
    private readonly availabilityFacade: AvailabilityFacade = inject(AvailabilityFacade),
  ) {}

  public async handleRequest(request: IRequest): Promise<Response> {
    const parsedBody = await BodyParser.parseBody(request);

    try {
      const availabilityCalendar = await this.availabilityFacade.getAvailabilityCalendar(parsedBody);

      return this.jsonResponseFactory.create(availabilityCalendar);
    } catch (e: any) {
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
