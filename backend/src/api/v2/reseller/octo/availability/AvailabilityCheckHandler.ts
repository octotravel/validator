import { inject, injectable } from '@needle-di/core';
import { HttpError } from '@octocloud/core';
import { IRequest } from 'itty-router';
import { AvailabilityFacade } from '../../../../../common/validation/v2/facade/availability/AvailabilityFacade';
import { SessionNotFoundError } from '../../../../../common/validation/v2/session/error/SessionNotFoundError';
import { SessionScenarioNotSetError } from '../../../../../common/validation/v2/session/error/SessionScenarioNotSetError';
import { SessionScenarioStepNotAllowedError } from '../../../../../common/validation/v2/session/error/SessionScenarioStepNotAllowedError';
import { ValidationError } from '../../../../../common/validation/v2/validator/error/ValidationError';
import { ErrorResponseFactory } from '../../../../http/error/ErrorResponseFactory';
import { JsonResponseFactory } from '../../../../http/json/JsonResponseFactory';
import { RequestHandler } from '../../../../http/request/RequestHandler';
import { BodyParser } from '../../../../util/BodyParser';

@injectable()
export class AvailabilityCheckHandler implements RequestHandler {
  public constructor(
    private readonly jsonResponseFactory = inject(JsonResponseFactory),
    private readonly errorResponseFactory = inject(ErrorResponseFactory),
    private readonly availabilityFacade = inject(AvailabilityFacade),
  ) {}

  public async handleRequest(request: IRequest): Promise<Response> {
    const parsedBody = await BodyParser.parseBody(request);

    try {
      const availability = await this.availabilityFacade.getAvailability(parsedBody);

      return this.jsonResponseFactory.create(availability);
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
