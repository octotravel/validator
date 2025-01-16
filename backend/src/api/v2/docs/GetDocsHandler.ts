import { inject, injectable } from '@needle-di/core';
import { IRequest } from 'itty-router';
import { JsonResponseFactory } from '../../http/json/JsonResponseFactory';
import { RequestHandler } from '../../http/request/RequestHandler';

export interface GetDocsResponse {
  docs: string;
}

@injectable()
export class GetDocsHandler implements RequestHandler {
  public constructor(private readonly jsonResponseFactory = inject(JsonResponseFactory)) {}

  public async handleRequest(request: IRequest): Promise<Response> {
    return this.jsonResponseFactory.create({
      docs: 'https://docs.octo.travel',
    });
  }
}
