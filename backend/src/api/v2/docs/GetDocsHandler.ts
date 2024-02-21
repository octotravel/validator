import { singleton } from 'tsyringe';

export interface GetDocsResponse {
  docs: string;
}

@singleton()
export class GetDocsHandler {
  public async handleRequest(request: Request): Promise<GetDocsResponse> {
    return {
      docs: 'https://docs.octo.travel',
    };
  }
}
