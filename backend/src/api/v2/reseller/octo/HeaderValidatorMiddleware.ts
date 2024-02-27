import { IRequest } from 'itty-router';
import { inject, singleton } from 'tsyringe';
import { RequestHeadersValidator } from '../../../../common/validation/v2/validator/request/RequestHeadersValidator';

@singleton()
export class HeaderValidatorMiddleware {
  public constructor(
    @inject(RequestHeadersValidator) private readonly requestHeadersValidator: RequestHeadersValidator,
  ) {}

  public async invoke(request: IRequest): Promise<Response | null> {
    await this.requestHeadersValidator.validate(request.headers);
    return null;
  }
}
