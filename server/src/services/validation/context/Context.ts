import { ProductContext } from "./ProductContext";
import { Capability, CapabilityId, Product } from "@octocloud/types";
import { ValidationEndpoint } from "../../../schemas/Validation";
import { ValidatorError } from "../../../validators/backendValidator/ValidatorHelpers";
import { ApiClient } from "../api/ApiClient";
import { DateHelper } from "../../../helpers/DateHelper";
import { addDays } from "date-fns";
import { v4 as uuid } from 'uuid';
import { SubRequestMapper } from "../../logging/SubRequestMapper";

export interface ErrorResult<T> {
  data: T | null;
  error: ValidatorError | null;
}
interface IContext {
  setCapabilities(capabilities: Capability[]): ValidatorError[];
  getCapabilityIDs(): CapabilityId[];
  setProducts(products: Product[]): ValidatorError[];
  getProduct(): Product;
}
export class Context implements IContext {
  private endpoint = '';
  private apiKey = '';
  private capabilities: CapabilityId[] = [];
  public _terminateValidation = false;
  public requestId: string = '';
  public subrequestMapper = new SubRequestMapper();
  private date = new Date();

  public subrequests: any[] = [];

  public invalidProductId = "invalidProductId";
  public invalidOptionId = "invalidOptionId";
  public invalidAvailabilityId = "invalidAvailabilityId";
  public invalidUUID = "invalidUUID";
  public note = "Test Note";
  private _shouldNotHydrate = true;

  public localDateStart = DateHelper.getDate(new Date().toISOString());
  public localDateEnd = DateHelper.getDate(
    addDays(new Date(), 30).toISOString()
  );

  public readonly productConfig = new ProductContext();

  public setSchema = (data: ValidationEndpoint) => {
    this.endpoint = data.backend.endpoint;
    this.apiKey = data.backend.apiKey;
    this.capabilities = [];
    this._terminateValidation = false;
    this.requestId = uuid();
  }

  public getApiClient = (): ApiClient => {
    return new ApiClient({
      url: this.endpoint,
      apiKey: this.apiKey,
      capabilities: this.getCapabilityIDs(),
    });
  };

  public get terminateValidation() {
    return this._terminateValidation;
  }

  public set terminateValidation(terminateValidation: boolean) {
    this._terminateValidation = terminateValidation;
  }

  public setCapabilities = (capabilities: Capability[]): ValidatorError[] => {
    const supportedCapabilityIds = [CapabilityId.Pricing];
    this.capabilities = capabilities.map((capability) => {
      return capability.id;
    }).filter(capabilityId => supportedCapabilityIds.includes(capabilityId));
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
