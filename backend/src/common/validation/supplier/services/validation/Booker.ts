import { Booking, BookingReservationBody, BookingUnitItem } from '@octocloud/types';
import { Result } from './api/types';
import { Context } from './context/Context';
import { ProductBookable } from './context/ProductBookable';

interface CreateReservationParams {
  invalidProductId?: boolean;
  invalidOptionId?: boolean;
  invalidAvailabilityId?: boolean;
  invalidUnitItems?: boolean;
  soldOutAvailability?: boolean;
  unitItemsMissing?: boolean;
  unitItemsEmpty?: boolean;
  unitItemsQuantity?: number;
}
export class Booker {
  public createReservation = async (
    productBookable: ProductBookable,
    context: Context,
    params?: CreateReservationParams,
  ): Promise<Result<Booking>> => {
    const apiClient = context.getApiClient();
    const { product } = productBookable;

    const productId = params?.invalidProductId ? context.invalidProductId : product.id;
    const optionId = params?.invalidOptionId ? context.invalidOptionId : productBookable.getOption().id;
    const unitItems = this.getUnitItems(productBookable, params);
    const availabilityId = this.getAvailabilityId(productBookable, context, unitItems, params);

    const data = {
      productId,
      optionId,
      availabilityId,
    } as BookingReservationBody;
    if (unitItems) {
      data.unitItems = unitItems;
    }

    return await apiClient.bookingReservation(data, context);
  };

  private getAvailabilityId(
    productBookable: ProductBookable,
    context: Context,
    unitItems: BookingUnitItem[] | null,
    params?: CreateReservationParams,
  ): string | null {
    if (params?.invalidAvailabilityId) {
      return context.invalidAvailabilityId;
    } else if (params?.soldOutAvailability) {
      return productBookable.availabilityIdSoldOut;
    }
    // Allocate a slot with enough vacancy for this reservation's units so the run spreads
    // across slots instead of exhausting one (see docs/reservation-availability-refactor.md).
    return productBookable.reserveSlot(Math.max(unitItems?.length ?? 1, 1));
  }

  private getUnitItems(productBookable: ProductBookable, params?: CreateReservationParams): BookingUnitItem[] | null {
    if (params?.invalidUnitItems) {
      return productBookable.getInvalidUnitItems();
    } else if (params?.unitItemsMissing) {
      return null;
    } else if (params?.unitItemsEmpty) {
      return [];
    }

    if (params?.unitItemsQuantity) {
      return productBookable.getValidUnitItems({
        quantity: params?.unitItemsQuantity,
      });
    }
    return productBookable.getValidUnitItems();
  }
}
