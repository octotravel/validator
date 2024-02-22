import { singleton, inject } from 'tsyringe';
import { IRequest } from 'itty-router';
import { SupplierFacade } from '../../../../../common/validator/v2/reseller/supplier/SupplierFacade';
import { Supplier } from '@octocloud/types';

@singleton()
export class GetSupplierHandler {
  public constructor(@inject(SupplierFacade) private readonly supplierFacade: SupplierFacade) {}

  public async handleRequest(request: IRequest): Promise<Supplier> {
    return await this.supplierFacade.getSupplier();
  }
}
