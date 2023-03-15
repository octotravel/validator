import { ProductContext } from "./ProductContext.ts";
import { Capability, CapabilityId, Product } from "https://esm.sh/@octocloud/types@1.5.2";
import { ValidationEndpoint } from "../../../schemas/Validation.ts";
import { ValidatorError } from "../../../validators/backendValidator/ValidatorHelpers.ts";
import { ApiClient } from "../api/ApiClient.ts";
import { DateHelper } from "../../../helpers/DateHelper.ts";
import { addDays } from "https://esm.sh/date-fns@2.29.1";

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

  constructor(data: ValidationEndpoint) {
    this.endpoint = data.backend.endpoint;
    this.apiKey = data.backend.apiKey;
    this.capabilities = [];
    this._terminateValidation = false;
  }

  public invalidProductId = "invalidProductId";
  public invalidOptionId = "invalidOptionId";
  public invalidAvailabilityId = "invalidAvailabilityId";
  public invalidUUID = "invalidUUID";
  public note = "Test Note";

  public localDateStart = DateHelper.getDate(new Date().toISOString());
  public localDateEnd = DateHelper.getDate(
    addDays(new Date(), 30).toISOString()
  );

  public readonly productConfig = new ProductContext();

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
    this.capabilities = capabilities.map((capability) => {
      return capability.id;
    });
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
}
