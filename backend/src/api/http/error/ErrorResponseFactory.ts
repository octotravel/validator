import { inject, singleton } from 'tsyringe';
import { ErrorResponse } from './ErrorResponse';
import { JsonResponseFactory } from '../json/JsonResponseFactory';
import { ErrorCode } from './ErrorCode';
import config from '../../../common/config/config';
import { Environment } from '@octocloud/core';

@singleton()
export class ErrorResponseFactory {
  private readonly S400_BAD_REQUEST = 400;
  private readonly S401_UNATHORIZED = 401;
  private readonly S403_FORBIDDEN = 403;
  private readonly S404_NOT_FOUND = 404;
  private readonly S405_METHOD_NOT_ALLOWED = 405;
  private readonly S422_UNPROCESSABLE_ENTITY = 422;
  private readonly S500_INTERNAL_SERVER_ERROR = 500;
  private readonly S501_NOT_IMPLEMENTED = 501;

  public constructor(@inject(JsonResponseFactory) private readonly jsonResponseFactory: JsonResponseFactory) {}

  public createBadRequestResponse(errorMessage: string, error: Error | null = null): Response {
    return this.createErrorResponse(this.S400_BAD_REQUEST, errorMessage, error);
  }

  public createUnauthorizedResponse(errorMessage: string, error: Error | null = null): Response {
    return this.createErrorResponse(this.S401_UNATHORIZED, errorMessage, error);
  }

  public createForbiddenResponse(errorMessage: string, error: Error | null = null): Response {
    return this.createErrorResponse(this.S403_FORBIDDEN, errorMessage, error);
  }

  public createNotFoundResponse(errorMessage: string, error: Error | null = null): Response {
    return this.createErrorResponse(this.S404_NOT_FOUND, errorMessage, error);
  }

  public createInternalServerErrorResponse(
    errorCode: ErrorCode = ErrorCode.INTERNAL_SERVER_ERROR,
    error: Error | null = null,
  ): Response {
    return this.createErrorResponse(this.S500_INTERNAL_SERVER_ERROR, errorCode, error);
  }

  public createValidationErrorResponse(data: any, error: Error | null = null): Response {
    return this.createErrorResponse(this.S422_UNPROCESSABLE_ENTITY, data, error);
  }

  public createErrorResponse(httpStatus: number, message: string, error: Error | null = null): Response {
    const env = config.getEnvironment();
    const isDebug = env === Environment.LOCAL || env === Environment.TEST;

    if (isDebug && error !== null) {
      return this.jsonResponseFactory.create(new ErrorResponse(message, error.stack), httpStatus);
    }

    return this.jsonResponseFactory.create(new ErrorResponse(message), httpStatus);
  }
}
