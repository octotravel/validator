import { BookingUnitItemSchema, Option, Product, UnitType } from '@octocloud/types';
import Prando from 'prando';

interface GetUnitItemsData {
  quantity: number;
}

interface GetAvailabilityIDData {
  omitID: string;
}

export class ProductBookable {
  public product: Product;
  private readonly _availabilityIdAvailable: string[] = [];
  private readonly _availabilityIdSoldOut: string | null;
  public constructor({
    product,
    availabilityIdAvailable,
    availabilityIdSoldOut,
  }: {
    product: Product;
    availabilityIdAvailable: string[] | null;
    availabilityIdSoldOut: string | null;
  }) {
    this.product = product;
    this._availabilityIdAvailable = availabilityIdAvailable ?? [];
    this._availabilityIdSoldOut = availabilityIdSoldOut;
  }

  public get availabilityIdAvailable(): string[] {
    return this._availabilityIdAvailable;
  }

  public get randomAvailabilityID(): string {
    return this.pickRandomAvailabilityID(this._availabilityIdAvailable);
  }

  public get availabilityIdSoldOut(): string | null {
    return this._availabilityIdSoldOut;
  }

  public get isSoldOut(): boolean {
    return this._availabilityIdSoldOut !== null;
  }

  public get isAvailable(): boolean {
    return this._availabilityIdAvailable?.length > 0;
  }

  public get hasMultipleAvailabilities(): boolean {
    return this._availabilityIdAvailable?.length === 2;
  }

  public getAvialabilityID = (data: GetAvailabilityIDData): string => {
    return this.pickRandomAvailabilityID(this._availabilityIdAvailable.filter((id) => id !== data.omitID));
  };

  private readonly pickRandomAvailabilityID = (array: string[]): string => {
    return array[new Prando(array.length).nextInt(0, array.length - 1)];
  };

  public getValidUnitItems = (data?: GetUnitItemsData): BookingUnitItemSchema[] => {
    const option = this.getOption();
    const unit = option.units.find((unit) => unit.type === UnitType.ADULT) ?? option.units[0];
    const unitId = unit.id;

    const quantity =
      data?.quantity ??
      new Prando(option.id).nextInt(option.restrictions.minUnits || 1, option.restrictions.maxUnits ?? 5);
    return Array(quantity).fill({ unitId });
  };

  public getInvalidUnitItems = (data?: GetUnitItemsData): BookingUnitItemSchema[] => {
    const quantity = data?.quantity ?? 1;
    const unitItems = Array.from({ length: quantity }, () => {
      return {
        unitId: 'invalidUnitId',
      };
    });
    return unitItems;
  };

  public getOption = (): Option => {
    const option = this.product.options.find((option: Option) => option.default) ?? this.product.options[0];

    return option;
  };
}
