import { IRequest, Router } from 'itty-router';
import { inject, singleton } from 'tsyringe';
import { CreateSessionHandler } from './session/CreateSessionHandler';
import { UpdateSessionHandler } from './session/UpdateSessionHandler';
import { GetSessionHandler } from './session/GetSessionHandler';
import { ResellerRouter } from './reseller/ResellerRouter';
import { GetSessionValidationHistoryHandler } from './session/GetSessionValidationHistoryHandler';
import { ValidateSessionQuestionsAnswersHandler } from './session/ValidateSessionQuestionsAnswersHandler';
import { RequestScopedContextProvider } from '../../common/requestContext/RequestScopedContextProvider';

@singleton()
export class V2Router {
  public readonly router;

  public constructor(
    @inject(CreateSessionHandler) private readonly createSessionHandler: CreateSessionHandler,
    @inject(GetSessionHandler) private readonly getSessionHandler: GetSessionHandler,
    @inject(UpdateSessionHandler) private readonly updateSessionHandler: UpdateSessionHandler,
    @inject(GetSessionValidationHistoryHandler)
    private readonly getSessionValidationHistoryHandler: GetSessionValidationHistoryHandler,
    @inject(ValidateSessionQuestionsAnswersHandler)
    private readonly validateSessionQuestionsAnswersHandler: ValidateSessionQuestionsAnswersHandler,
    @inject(ResellerRouter) private readonly resellerRouter: ResellerRouter,
    @inject(RequestScopedContextProvider) private readonly requestScopedContextProvider: RequestScopedContextProvider,
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
