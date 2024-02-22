import { inject, singleton } from 'tsyringe';
import { Backend, RequestContext } from '@octocloud/core';
import { Supplier } from '@octocloud/types';

@singleton()
export class SupplierFacade {
  public constructor(@inject('Backend') private readonly backend: Backend) {}

  public async getSupplier(): Promise<Supplier> {
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

    return await this.backend.getSupplier({
      ctx: requestContext,
    });
  }
}
