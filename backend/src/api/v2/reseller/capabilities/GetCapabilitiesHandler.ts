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
    const capabilities = $enum(CapabilityId).getValues();
    return this.jsonResponseFactory.create(CapabilityResponseFactory.create(capabilities));
  }
}
