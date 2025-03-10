import { Availability, PickupPoint } from '@octocloud/types';
import {
  BooleanValidator,
  ModelValidator,
  NumberValidator,
  StringValidator,
  ValidatorError,
} from '../ValidatorHelpers';

export class AvailabilityPickupValidator implements ModelValidator {
  private readonly path: string;
  public constructor({ path }: { path: string }) {
    this.path = path;
  }

  public validate = (availability: Availability): ValidatorError[] => {
    return [
      BooleanValidator.validate(`${this.path}.pickupAvailable`, availability?.pickupAvailable),
      BooleanValidator.validate(`${this.path}.pickupRequired`, availability?.pickupRequired),
      ...this.validatePickupPoints(availability?.pickupPoints ?? ([] as PickupPoint[])),
    ].flatMap((v) => (v ? [v] : []));
  };

  private readonly validatePickupPoints = (pickupPoints: PickupPoint[]): ValidatorError[] => {
    return pickupPoints
      .flatMap((pickupPoint, i) => [
        StringValidator.validate(`${this.path}.pickupPoints[${i}].id`, pickupPoint?.id),
        StringValidator.validate(`${this.path}.pickupPoints[${i}].name`, pickupPoint?.name),
        StringValidator.validate(`${this.path}.pickupPoints[${i}].directions`, pickupPoint?.directions, {
          nullable: true,
        }),
        StringValidator.validate(`${this.path}.pickupPoints[${i}].address`, pickupPoint?.address),
        NumberValidator.validate(`${this.path}.pickupPoints[${i}].latitude`, pickupPoint?.latitude, { nullable: true }),
        NumberValidator.validate(`${this.path}.pickupPoints[${i}].longitude`, pickupPoint?.longitude, {
          nullable: true,
        }),
        StringValidator.validate(`${this.path}.pickupPoints[${i}].googlePlaceId`, pickupPoint?.googlePlaceId, {
          nullable: true,
        }),
        StringValidator.validate(`${this.path}.pickupPoints[${i}].street`, pickupPoint?.street, { nullable: true }),
        StringValidator.validate(`${this.path}.pickupPoints[${i}].postalCode`, pickupPoint?.postalCode, {
          nullable: true,
        }),
        StringValidator.validate(`${this.path}.pickupPoints[${i}].locality`, pickupPoint?.locality, { nullable: true }),
        StringValidator.validate(`${this.path}.pickupPoints[${i}].region`, pickupPoint?.region, { nullable: true }),
        StringValidator.validate(`${this.path}.pickupPoints[${i}].state`, pickupPoint?.state, { nullable: true }),
        StringValidator.validate(`${this.path}.pickupPoints[${i}].country`, pickupPoint?.country, { nullable: true }),
      ])
      .flatMap((v) => (v ? [v] : []));
  };
}
