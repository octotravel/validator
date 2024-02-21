import * as R from 'ramda';
import { AvailabilityType, Product, Availability } from '@octocloud/types';
import { ErrorType, ValidatorError } from '../../../validators/backendValidator/ValidatorHelpers';
import { ProductBookable } from './ProductBookable';

export class ProductContext {
  private _openingHourProducts: Product[] = [];
  private _startTimeProducts: Product[] = [];
  private _products: Product[] = [];
  private _soldOutProduct: ProductBookable | null = null;
  private _availableProducts: ProductBookable[] = [];
  private _availability: Record<string, Availability> = {};

  public setProducts = (products: Product[]): ValidatorError[] => {
    this._products = products;
    if (this.areProductsValid(products)) {
      return [
        new ValidatorError({
          type: ErrorType.CRITICAL,
          message: 'No products provided',
        }),
      ];
    }
    const errors = new Array<ValidatorError>();
    const startTimeProducts = products.filter((p) => p.availabilityType === AvailabilityType.START_TIME);

    this._startTimeProducts = startTimeProducts;
    if (!this.hasStartTimeProducts) {
      errors.push(
        new ValidatorError({
          message: `No products with availabilityType=${AvailabilityType.START_TIME} provided`,
        }),
      );
    }

    const openingHourProducts = products.filter((p) => p.availabilityType === AvailabilityType.OPENING_HOURS);
    this._openingHourProducts = openingHourProducts;
    if (!this.hasOpeningHourProducts) {
      errors.push(
        new ValidatorError({
          message: `No products with availabilityType=${AvailabilityType.OPENING_HOURS} provided`,
        }),
      );
    }

    return errors;
  };

  public areProductsValid(product: Product[]): boolean {
    return R.isEmpty(product) || R.isNil(product) || !R.is(Array, product);
  }

  public set soldOutProduct(soldOutProduct: ProductBookable) {
    this._soldOutProduct = soldOutProduct;
  }

  public get soldOutProduct(): ProductBookable | null {
    return this._soldOutProduct!;
  }

  public set availableProducts(availableProducts: ProductBookable[]) {
    this._availableProducts = [...this._availableProducts, ...availableProducts];
  }

  public get availableProducts(): ProductBookable[] {
    return this._availableProducts;
  }

  public get hasOpeningHourProducts(): boolean {
    return this._openingHourProducts.length !== 0;
  }

  public get hasStartTimeProducts(): boolean {
    return this._startTimeProducts.length !== 0;
  }

  public get products(): Product[] {
    return this._products;
  }

  public get startTimeProducts(): Product[] {
    return this._startTimeProducts;
  }

  public get openingHourProducts(): Product[] {
    return this._openingHourProducts;
  }

  public get isRebookAvailable(): boolean {
    return this.availableProducts.length >= 2;
  }

  public get productsForAvailabilityCheck(): Product[] {
    const products = Array<Product>();
    if (this.hasOpeningHourProducts) {
      products.push(this.openingHourProducts[0]);
    }
    if (this.hasStartTimeProducts) {
      products.push(this.startTimeProducts[0]);
    }
    return products;
  }

  public set addAvailability({
    availabilityType,
    availability,
  }: {
    availabilityType: AvailabilityType;
    availability: Availability;
  }) {
    this._availability[availabilityType] = availability;
  }

  public get availability(): Record<string, Availability> {
    return this._availability;
  }

  // public set availabilityIDs(data: Record<AvailabilityType, string | null>){
  //   this._availabilityIDs = data
  // }
}
