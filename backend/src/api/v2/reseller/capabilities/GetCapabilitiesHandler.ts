import { JsonResponseFactory } from '../../../http/json/JsonResponseFactory';
import { IRequest } from 'itty-router';
import { CapabilityId } from '@octocloud/types';
import { RequestHandler } from '../../../http/request/RequestHandler';
import { CapabilityResponseFactory } from './CapabilityResponseFactory';
import { inject } from '@needle-di/core';

export class GetCapabilitiesHandler implements RequestHandler {
  public constructor(private readonly jsonResponseFactory: JsonResponseFactory = inject(JsonResponseFactory)) {}

  public async handleRequest(request: IRequest): Promise<Response> {
    return this.jsonResponseFactory.create(
      CapabilityResponseFactory.create(
        'https://docs.octo.travel/getting-started/endpoints-and-capabilities#capabilities',
        [CapabilityId.Pricing],
      ),
    );
  }
}
