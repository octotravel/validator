import { inject, singleton } from 'tsyringe';
import { JsonResponseFactory } from '../../http/json/JsonResponseFactory';
import { RequestHandler } from '../../http/request/RequestHandler';
import { IRequest } from 'itty-router';

export interface GetDocsResponse {
  docs: string;
}

@singleton()
export class GetDocsHandler implements RequestHandler {
  public constructor(@inject(JsonResponseFactory) private readonly jsonResponseFactory: JsonResponseFactory) {}

  public async handleRequest(request: IRequest): Promise<Response> {
    return this.jsonResponseFactory.create({
      docs: 'https://docs.octo.travel',
    });
  }
}
