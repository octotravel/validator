import * as R from "npm:ramda@^0.28.0";
import { AvailabilityType, Product } from "npm:@octocloud/types@^1.3.1";
import {
  ErrorType,
  ValidatorError,
} from "../../../validators/backendValidator/ValidatorHelpers.ts";
import { ProductBookable } from "./ProductBookable.ts";

export class ProductConfig {
  private _openingHourProducts: Product[] = [];
  private _startTimeProducts: Product[] = [];
  private _products: Product[] = [];
  private _soldOutProduct: ProductBookable | null = null;
  private _availableProducts: ProductBookable[] = [];
  private _availabilityIDs: { [key: string]: string } = {};

  public setProducts = (products: Product[]): ValidatorError[] => {
    this._products = products;
    if (this.areProductsValid(products)) {
      return [
        new ValidatorError({
          type: ErrorType.CRITICAL,
          message: `No products provided`,
        }),
      ];
    }
    const errors = new Array<ValidatorError>();
    const startTimeProducts = products.filter(
      (p) => p.availabilityType === AvailabilityType.START_TIME
    );

    this._startTimeProducts = startTimeProducts;
    if (!this.hasStartTimeProducts) {
      errors.push(
        new ValidatorError({
          message: `No products with availabilityType=${AvailabilityType.START_TIME} provided`,
        })
      );
    }

    const openingHourProducts = products.filter(
      (p) => p.availabilityType === AvailabilityType.OPENING_HOURS
    );
    this._openingHourProducts = openingHourProducts;
    if (!this.hasOpeningHourProducts) {
      errors.push(
        new ValidatorError({
          message: `No products with availabilityType=${AvailabilityType.OPENING_HOURS} provided`,
        })
      );
    }

    return errors;
  };

  public areProductsValid(product: Product[]) {
    return R.isEmpty(product) || R.isNil(product) || !R.is(Array, product);
  }

  public set soldOutProduct(soldOutProduct: ProductBookable) {
    this._soldOutProduct = soldOutProduct;
  }

  public get soldOutProduct() {
    return this._soldOutProduct as ProductBookable
  }

  public set availableProducts(availableProducts: ProductBookable[]) {
    this._availableProducts = [
      ...this._availableProducts,
      ...availableProducts,
    ];
  }

  public get availableProducts() {
    return this._availableProducts;
  }

  public get hasOpeningHourProducts() {
    return this._openingHourProducts.length !== 0;
  }

  public get hasStartTimeProducts() {
    return this._startTimeProducts.length !== 0;
  }

  public get products() {
    return this._products;
  }

  public get startTimeProducts() {
    return this._startTimeProducts;
  }

  public get openingHourProducts() {
    return this._openingHourProducts;
  }

  public get isRebookAvailable() {
    return this.availableProducts.length >= 2;
  }

  public get productsForAvailabilityCheck() {
    const products = Array<Product>();
    if (this.hasOpeningHourProducts) {
      products.push(this.openingHourProducts[0]);
    }
    if (this.hasStartTimeProducts) {
      products.push(this.startTimeProducts[0]);
    }
    return products;
  }

  public set addAvailabilityID({
    availabilityType,
    availabilityID,
  }: {
    availabilityType: AvailabilityType;
    availabilityID: string;
  }) {
    this._availabilityIDs[availabilityType] = availabilityID;
  }

  public get availabilityIDs() {
    return this._availabilityIDs;
  }

  // public set availabilityIDs(data: Record<AvailabilityType, string | null>){
  //   this._availabilityIDs = data
  // }
}