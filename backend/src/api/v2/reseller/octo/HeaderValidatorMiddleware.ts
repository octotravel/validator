import { IRequest } from 'itty-router';
import { inject, singleton } from 'tsyringe';
import { RequestHeadersValidator } from '../../../../common/validation/v2/validator/request/RequestHeadersValidator';
import { ErrorResponseFactory } from '../../../http/error/ErrorResponseFactory';

@singleton()
export class HeaderValidatorMiddleware {
  public constructor(
    @inject(RequestHeadersValidator) private readonly requestHeadersValidator: RequestHeadersValidator,
    @inject(ErrorResponseFactory) private readonly errorResponseFactory: ErrorResponseFactory,
  ) {}

  public async invoke(request: IRequest): Promise<Response | null> {
    const validationResult = await this.requestHeadersValidator.validate(request.headers);

    if (validationResult.isValid()) {
      return null;
    }

    return this.errorResponseFactory.createValidationErrorResponse(validationResult);
  }
}
