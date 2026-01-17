import { ResellerRequestLog } from '../../../types/ResellerRequestLog';
import { RequestScopedContext } from '../../requestContext/RequestScopedContext';

export class ResellerRequestLogFactory {
  public static async createFromContext(requestScopedContext: RequestScopedContext): Promise<ResellerRequestLog> {
    const request = requestScopedContext.getRequest();
    const response = requestScopedContext.getResponse();
    const validationResult = requestScopedContext.getValidationResult();

    return {
      id: requestScopedContext.getRequestId(),
      sessionId: requestScopedContext.getSession().id,
      scenarioId: requestScopedContext.getSession().currentScenario!,
      stepId: requestScopedContext.getStep().getId(),
      createdAt: new Date(),
      reqBody: await ResellerRequestLogFactory.parseBody(request),
      reqMethod: request.method,
      reqUrl: request.url,
      reqHeaders: JSON.stringify(ResellerRequestLogFactory.transformHeaders(request.headers)),
      resStatus: response.status,
      resHeaders: JSON.stringify(ResellerRequestLogFactory.transformHeaders(response.headers)),
      resBody: await ResellerRequestLogFactory.parseBody(response),
      resDuration: 0,
      validationResult: JSON.stringify(validationResult),
      isValid: validationResult.isValid(),
      hasCorrectlyAnsweredQuestions: requestScopedContext.getStep().getQuestions().length === 0,
    };
  }

  private static transformHeaders(headers: Headers): Record<string, string> {
    const obj: Record<string, string> = {};
    headers.forEach((value, key) => {
      obj[key] = value;
    });

    return obj;
  }

  private static async parseBody(bodyHolder: Request | Response): Promise<string> {
    try {
      return await bodyHolder.json();
    } catch (err) {
      return await bodyHolder.text();
    }
  }
}
