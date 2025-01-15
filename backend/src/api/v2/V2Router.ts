import { IRequest, Router } from 'itty-router';

import { inject } from '@needle-di/core';
import { RequestScopedContextProvider } from '../../common/requestContext/RequestScopedContextProvider';
import { ResellerRouter } from './reseller/ResellerRouter';
import { CreateSessionHandler } from './session/CreateSessionHandler';
import { GetSessionHandler } from './session/GetSessionHandler';
import { GetSessionValidationHistoryHandler } from './session/GetSessionValidationHistoryHandler';
import { UpdateSessionHandler } from './session/UpdateSessionHandler';
import { ValidateSessionQuestionsAnswersHandler } from './session/ValidateSessionQuestionsAnswersHandler';

export class V2Router {
  public readonly router;

  public constructor(
    private readonly createSessionHandler: CreateSessionHandler = inject(CreateSessionHandler),
    private readonly getSessionHandler: GetSessionHandler = inject(GetSessionHandler),
    private readonly updateSessionHandler: UpdateSessionHandler = inject(UpdateSessionHandler),
    private readonly getSessionValidationHistoryHandler: GetSessionValidationHistoryHandler = inject(
      GetSessionValidationHistoryHandler,
    ),
    private readonly validateSessionQuestionsAnswersHandler: ValidateSessionQuestionsAnswersHandler = inject(
      ValidateSessionQuestionsAnswersHandler,
    ),
    private readonly resellerRouter: ResellerRouter = inject(ResellerRouter),
    private readonly requestScopedContextProvider: RequestScopedContextProvider = inject(RequestScopedContextProvider),
  ) {
    this.router = Router({
      base: '/v2',
      before: [
        async (req: IRequest): Promise<null> => {
          const ventrataRequestContext = this.requestScopedContextProvider
            .getRequestScopedContext()
            .getVentrataRequestContext();
          ventrataRequestContext.setChannel('Octo Reseller Validator');
          ventrataRequestContext.setAction('Validation');
          return null;
        },
      ],
      after: [
        async (req: IRequest): Promise<null> => {
          const requestScopedContext = this.requestScopedContextProvider.getRequestScopedContext();
          const ventrataRequestContext = requestScopedContext.getVentrataRequestContext();
          ventrataRequestContext.setAction(requestScopedContext.getStep().getName());
          return null;
        },
      ],
    });

    this.router.get('/session/:sessionId', async (request) => await this.getSessionHandler.handleRequest(request));
    this.router.post('/session', async (request) => await this.createSessionHandler.handleRequest(request));
    this.router.put('/session/:sessionId', async (request) => await this.updateSessionHandler.handleRequest(request));
    this.router.get(
      '/session/:sessionId/validation-history/:scenarioId',
      async (request) => await this.getSessionValidationHistoryHandler.handleRequest(request),
    );
    this.router.post(
      '/session/:sessionId/validate-question-answers/:scenarioId/:stepId',
      async (request) => await this.validateSessionQuestionsAnswersHandler.handleRequest(request),
    );

    this.router.all('/reseller/*', this.resellerRouter.router.fetch);
  }
}
