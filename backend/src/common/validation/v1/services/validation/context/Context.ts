import { Capability, CapabilityId, Product } from '@octocloud/types';
import { addDays } from 'date-fns';
import { v4 as uuid } from 'uuid';
import { ValidationEndpoint } from '../../../../../../api/v1/validate/ValidationSchema';
import { DateHelper } from '../../../helpers/DateHelper';
import { ValidatorError } from '../../../validators/backendValidator/ValidatorHelpers';
import { ApiClient } from '../api/ApiClient';
import { AvailabilityContext } from './AvailabilityContext';
import { ProductContext } from './ProductContext';

export interface ErrorResult<T> {
  data: T | null;
  error: ValidatorError | null;
}
interface IContext {
  setCapabilities: (capabilities: Capability[]) => ValidatorError[];
  getCapabilityIDs: () => CapabilityId[];
  setProducts: (products: Product[]) => ValidatorError[];
  getProduct: () => Product;
}
export class Context implements IContext {
  private endpoint = '';
  private headers = {};
  private capabilities: CapabilityId[] = [];
  public _terminateValidation = false;
  private _useRequestContext = true;
  public requestId = '';
  private readonly date = new Date();

  public invalidProductId = 'invalidProductId';
  public invalidOptionId = 'invalidOptionId';
  public invalidAvailabilityId = 'invalidAvailabilityId';
  public invalidUUID = 'invalidUUID';
  public note = 'Test Note';
  private readonly _shouldNotHydrate = true;

  public localDateStart = DateHelper.getDate(new Date().toISOString());
  public localDateEnd = DateHelper.getDate(addDays(new Date(), 30).toISOString());

  public readonly productConfig = new ProductContext();
  public readonly availabilityConfig = new AvailabilityContext();

  public setSchema = (data: ValidationEndpoint): void => {
    this.endpoint = data.backend.endpoint;
    this.headers = data.backend.headers;
    this.capabilities = [];
    this._terminateValidation = false;
    this.requestId = uuid();
  };

  public getApiClient = (): ApiClient => {
    return new ApiClient({
      url: this.endpoint,
      headers: this.headers,
      capabilities: this.getCapabilityIDs(),
    });
  };

  public get terminateValidation(): boolean {
    return this._terminateValidation;
  }

  public set terminateValidation(terminateValidation: boolean) {
    this._terminateValidation = terminateValidation;
  }

  public get useRequestContext(): boolean {
    return this._useRequestContext;
  }

  public set useRequestContext(useRequestContext: boolean) {
    this._useRequestContext = useRequestContext;
  }

  public setCapabilities = (capabilities: Capability[]): ValidatorError[] => {
    const supportedCapabilities = [CapabilityId.Pricing];
    this.capabilities = capabilities
      .map((capability) => {
        return capability.id;
      })
      .filter((capabilityId) => supportedCapabilities.includes(capabilityId));
    return [];
  };

  public getCapabilityIDs = (): CapabilityId[] => {
    return this.capabilities;
  };

  public setProducts = (products: Product[]): ValidatorError[] => {
    if (this.productConfig.areProductsValid(products)) {
      this.terminateValidation = true;
    }

    return this.productConfig.setProducts(products);
  };

  public getProduct = (): Product => {
    return this.productConfig.products[0];
  };

  public getDuration = (start: Date, end: Date): number => {
    return (end.getTime() - start.getTime()) / 1000;
  };

  public getRequestDuration = (): number => this.getDuration(this.date, new Date());

  public get shouldNotHydrate(): boolean {
    return this._shouldNotHydrate;
  }
}
