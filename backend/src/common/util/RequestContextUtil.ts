import { RequestContext } from '@octocloud/core';

export class RequestContextUtil {
  public static create(): RequestContext {
    const requestContext = new RequestContext({
      request: new Request('https://octo.ventrata.com', {
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    });

    requestContext.setConnection({
      id: 'id',
      supplierId: 'Viator',
      apiKey: 'apiKey',
      endpoint: 'https://mock.octo.travel',
      accountId: 'accountId',
      name: 'name',
    });

    return requestContext;
  }
}
