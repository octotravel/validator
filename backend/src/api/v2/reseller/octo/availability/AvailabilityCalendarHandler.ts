import { singleton, inject } from 'tsyringe';
import { IRequest } from 'itty-router';
import { JsonResponseFactory } from '../../../../http/json/JsonResponseFactory';
import { RequestHandler } from '../../../../http/request/RequestHandler';
import { SessionNotFoundError } from '../../../../../common/validation/v2/session/error/SessionNotFoundError';
import { ErrorResponseFactory } from '../../../../http/error/ErrorResponseFactory';
import { SessionScenarioStepNotAllowedError } from '../../../../../common/validation/v2/session/error/SessionScenarioStepNotAllowedError';
import { SessionScenarioNotSetError } from '../../../../../common/validation/v2/session/error/SessionScenarioNotSetError';
import { AvailabilityFacade } from '../../../../../common/validation/v2/reseller/availability/AvailabilityFacade';
import { BodyParser } from '../../../../util/BodyParser';

@singleton()
export class AvailabilityCalendarHandler implements RequestHandler {
  public constructor(
    @inject(JsonResponseFactory) private readonly jsonResponseFactory: JsonResponseFactory,
    @inject(ErrorResponseFactory) private readonly errorResponseFactory: ErrorResponseFactory,
    @inject(AvailabilityFacade) private readonly availabilityFacade: AvailabilityFacade,
  ) {}

  public async handleRequest(request: IRequest): Promise<Response> {
    const sessionId = request.sessionId;
    const parsedBody = await BodyParser.parseBody(request);

    try {
      const availabilityCalendar = await this.availabilityFacade.getAvailabilityCalendar(parsedBody, sessionId);

      return this.jsonResponseFactory.create(availabilityCalendar);
    } catch (e: any) {
      if (e instanceof SessionNotFoundError) {
        return this.errorResponseFactory.createNotFoundResponse(e.message, e);
      } else if (e instanceof SessionScenarioNotSetError) {
        return this.errorResponseFactory.createBadRequestResponse(e.message, e);
      } else if (e instanceof SessionScenarioStepNotAllowedError) {
        return this.errorResponseFactory.createForbiddenResponse(e.message, e);
      }

      throw e;
    }
  }
}