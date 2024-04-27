import { RequestLog } from '../../types/RequestLog';
import { RequestScopedContext } from '../requestContext/RequestScopedContext';

export class RequestLogFactory {
  public static async createFromContext(requestScopedContext: RequestScopedContext): Promise<RequestLog> {
    const request = requestScopedContext.getRequest();
    const response = requestScopedContext.getResponse();
    const validationResult = requestScopedContext.getValidationResult();

    return {
      id: requestScopedContext.getRequestId(),
      sessionId: requestScopedContext.getSessionId(),
      scenarioId: requestScopedContext.getScenarioId(),
      stepId: requestScopedContext.getStepId(),
      createdAt: new Date(),
      reqBody: await RequestLogFactory.parseBody(request),
      reqMethod: request.method,
      reqUrl: request.url,
      reqHeaders: JSON.stringify(RequestLogFactory.transformHeaders(request.headers)),
      resStatus: response.status,
      resHeaders: JSON.stringify(RequestLogFactory.transformHeaders(response.headers)),
      resBody: await RequestLogFactory.parseBody(response),
      resDuration: 0,
      validationResult: JSON.stringify(validationResult),
      isValid: validationResult.isValid(),
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
