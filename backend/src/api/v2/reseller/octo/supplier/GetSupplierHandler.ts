import { singleton, inject } from 'tsyringe';
import { IRequest } from 'itty-router';
import { SupplierFacade } from '../../../../../common/validation/v2/reseller/supplier/SupplierFacade';
import { JsonResponseFactory } from '../../../../http/json/JsonResponseFactory';
import { RequestHandler } from '../../../../http/request/RequestHandler';

@singleton()
export class GetSupplierHandler implements RequestHandler {
  public constructor(
    @inject(JsonResponseFactory) private readonly jsonResponseFactory: JsonResponseFactory,
    @inject(SupplierFacade) private readonly supplierFacade: SupplierFacade,
  ) {}

  public async handleRequest(request: IRequest): Promise<Response> {
    const supplier = await this.supplierFacade.getSupplier();

    return this.jsonResponseFactory.create(supplier);
  }
}
