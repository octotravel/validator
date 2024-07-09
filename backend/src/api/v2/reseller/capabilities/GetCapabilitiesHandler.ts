import { inject, singleton } from 'tsyringe';
import { JsonResponseFactory } from '../../../http/json/JsonResponseFactory';
import { IRequest } from 'itty-router';
import { CapabilityId } from '@octocloud/types';
import { $enum } from 'ts-enum-util';
import { RequestHandler } from '../../../http/request/RequestHandler';
import { CapabilityResponseFactory } from './CapabilityResponseFactory';

@singleton()
export class GetCapabilitiesHandler implements RequestHandler {
  public constructor(@inject(JsonResponseFactory) private readonly jsonResponseFactory: JsonResponseFactory) {}

  public async handleRequest(request: IRequest): Promise<Response> {
    return this.jsonResponseFactory.create(
      CapabilityResponseFactory.create(
        'https://docs.octo.travel/getting-started/endpoints-and-capabilities#capabilities',
        [CapabilityId.Pricing],
      ),
    );
  }
}
