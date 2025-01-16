import { inject, injectable } from '@needle-di/core';
import { Environment } from '@octocloud/core';
import config from '../../../common/config/config';
import { JsonResponseFactory } from '../json/JsonResponseFactory';
import { ErrorResponse } from './ErrorResponse';

@injectable()
export class ErrorResponseFactory {
  private readonly S400_BAD_REQUEST = 400;
  private readonly BAD_REQUEST = 'BAD_REQUEST';
  private readonly S401_UNATHORIZED = 401;
  private readonly UNATHORIZED = 'UNATHORIZED';
  private readonly S403_FORBIDDEN = 403;
  private readonly FORBIDDEN = 'FORBIDDEN';
  private readonly S404_NOT_FOUND = 404;
  private readonly NOT_FOUND = 'NOT_FOUND';
  private readonly S422_UNPROCESSABLE_ENTITY = 422;
  private readonly UNPROCESSABLE_ENTITY = 'UNPROCESSABLE_ENTITY';

  public constructor(private readonly jsonResponseFactory: JsonResponseFactory = inject(JsonResponseFactory)) {}

  public createBadRequestResponse(errorMessage: string, error: Error | null = null): Response {
    return this.createErrorResponse(this.S400_BAD_REQUEST, this.BAD_REQUEST, errorMessage, error);
  }

  public createUnauthorizedResponse(errorMessage: string, error: Error | null = null): Response {
    return this.createErrorResponse(this.S401_UNATHORIZED, this.UNATHORIZED, errorMessage, error);
  }

  public createForbiddenResponse(errorMessage: string, error: Error | null = null): Response {
    return this.createErrorResponse(this.S403_FORBIDDEN, this.FORBIDDEN, errorMessage, error);
  }

  public createNotFoundResponse(errorMessage: string, error: Error | null = null): Response {
    return this.createErrorResponse(this.S404_NOT_FOUND, this.NOT_FOUND, errorMessage, error);
  }

  public createInternalServerErrorResponse(errorMessage: string, error: Error | null = null): Response {
    return this.createErrorResponse(this.S404_NOT_FOUND, this.NOT_FOUND, errorMessage, error);
  }

  public createValidationErrorResponse(data: unknown, error: Error | null = null): Response {
    return this.createErrorResponse(
      this.S422_UNPROCESSABLE_ENTITY,
      this.UNPROCESSABLE_ENTITY,
      'The request headers or body is not formatted correctly, you have missing required fields or any of the data types are incorrect',
      error,
      data,
    );
  }

  public createErrorResponse(
    httpStatus: number,
    errorCode: string,
    errorMessage: string,
    error: Error | null = null,
    errorData: unknown = {},
  ): Response {
    const env = config.getEnvironment();
    const isDebug = env === Environment.LOCAL || env === Environment.TEST;
    const errorResponse = new ErrorResponse(
      errorCode,
      errorMessage,
      errorData,
      isDebug ? (error?.stack ?? '') : undefined,
    );

    return this.jsonResponseFactory.create(errorResponse, httpStatus);
  }
}
