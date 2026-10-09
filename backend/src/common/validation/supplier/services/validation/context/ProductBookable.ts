import { Availability, BookingUnitItem, Option, Product, UnitType } from '@octocloud/types';
import { PseudoRandomGenerator } from '../../../helpers/PseudoRandomGenerator';

interface GetUnitItemsData {
  quantity: number;
}

interface GetAvailabilityIDData {
  omitID?: string | null;
}

export class ProductBookable {
  public product: Product;
  private readonly _availabilitiesAvailable: Availability[] = [];
  private readonly _availabilityIdSoldOut: string | null;
  private readonly reservedVacancies = new Map<string, number>();
  public constructor({
    product,
    availabilitiesAvailable,
    availabilityIdSoldOut,
  }: {
    product: Product;
    availabilitiesAvailable: Availability[] | null;
    availabilityIdSoldOut: string | null;
  }) {
    this.product = product;
    this._availabilitiesAvailable = availabilitiesAvailable ?? [];
    this._availabilityIdSoldOut = availabilityIdSoldOut;
  }

  public get availabilityIdAvailable(): string[] {
    return this._availabilitiesAvailable.map((availability) => availability.id);
  }

  public get availabilityIdSoldOut(): string | null {
    return this._availabilityIdSoldOut;
  }

  public get isSoldOut(): boolean {
    return this._availabilityIdSoldOut !== null;
  }

  public get isAvailable(): boolean {
    return this._availabilitiesAvailable.length > 0;
  }

  public get hasMultipleAvailabilities(): boolean {
    return this._availabilitiesAvailable.length === 2;
  }

  public getAvailabilityID = (data?: GetAvailabilityIDData): string | undefined => {
    const pool = this._availabilitiesAvailable.filter((availability) => availability.id !== data?.omitID);
    const [mostVacancies] = pool.sort((a, b) => this.remainingVacancies(b) - this.remainingVacancies(a));
    return mostVacancies?.id;
  };

  public reserveVacancies = (availabilityId: string, quantity: number): void => {
    this.reservedVacancies.set(availabilityId, (this.reservedVacancies.get(availabilityId) ?? 0) + quantity);
  };

  private readonly remainingVacancies = (availability: Availability): number => {
    if (availability.vacancies == null) {
      return Number.POSITIVE_INFINITY;
    }
    return availability.vacancies - (this.reservedVacancies.get(availability.id) ?? 0);
  };

  public getValidUnitItems = (data?: GetUnitItemsData): BookingUnitItem[] => {
    const option = this.getOption();
    const unit = option.units.find((unit) => unit.type === UnitType.ADULT) ?? option.units[0];
    const unitId = unit.id;

    const quantity =
      data?.quantity ??
      new PseudoRandomGenerator(option.id).nextInt(
        option.restrictions.minUnits || 1,
        option.restrictions.maxUnits ?? 5,
      );
    return Array(quantity).fill({ unitId });
  };

  public getInvalidUnitItems = (data?: GetUnitItemsData): BookingUnitItem[] => {
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
