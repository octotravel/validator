import { BackendParams, RequestContext } from '@octocloud/core';

export class BackendParamsUtil {
  public static create(): BackendParams {
    const requestContext = new RequestContext({
      request: new Request('https://octo.ventrata.com', {
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    });

    const accountId = 'accountId';

    requestContext.setConnection({
      id: 'id',
      supplierId: 'Viator',
      apiKey: 'apiKey',
      endpoint: 'https://mock.octo.travel',
      accountId: accountId,
      name: 'name',
    });
    requestContext.setAccountId(accountId);

    return {
      ctx: requestContext,
    };
  }
}
