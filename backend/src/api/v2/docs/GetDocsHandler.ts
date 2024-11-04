import { inject } from '@needle-di/core';
import { JsonResponseFactory } from '../../http/json/JsonResponseFactory';
import { RequestHandler } from '../../http/request/RequestHandler';
import { IRequest } from 'itty-router';

export interface GetDocsResponse {
  docs: string;
}

export class GetDocsHandler implements RequestHandler {
  public constructor(private readonly jsonResponseFactory: JsonResponseFactory = inject(JsonResponseFactory)) {}

  public async handleRequest(request: IRequest): Promise<Response> {
    return this.jsonResponseFactory.create({
      docs: 'https://docs.octo.travel',
    });
  }
}
