import { inject, singleton } from 'tsyringe';
import { JsonResponseFactory } from '../../../http/json/JsonResponseFactory';
import { IRequest } from 'itty-router';
import { CapabilityId } from '@octocloud/types';
import { $enum } from 'ts-enum-util';
import { RequestHandler } from '../../../http/request/RequestHandler';
import { CapabilityResponse } from './CapabilityResponse';
import { CapabilitiesResponse } from './CapabilitiesResponse';

@singleton()
export class GetCapabilitiesHandler implements RequestHandler {
  public constructor(@inject(JsonResponseFactory) private readonly jsonResponseFactory: JsonResponseFactory) {}

  public async handleRequest(request: IRequest): Promise<Response> {
    const capabilities = $enum(CapabilityId).map((capability) => CapabilityResponse.create(capability));
    return this.jsonResponseFactory.create(new CapabilitiesResponse(capabilities));
  }
}
