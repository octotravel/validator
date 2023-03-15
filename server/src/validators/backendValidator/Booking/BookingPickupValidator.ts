import { Booking } from "https://esm.sh/@octocloud/types@1.5.2";
import {
  StringValidator,
  ModelValidator,
  ValidatorError,
  BooleanValidator,
  NumberValidator,
} from "../ValidatorHelpers.ts";
import { CommonValidator } from "../CommonValidator.ts";

export class BookingPickupValidator implements ModelValidator {
  private path: string;
  constructor({ path }: { path: string }) {
    this.path = path;
  }

  public validate = (booking: Booking | null): ValidatorError[] => {
    return [
      BooleanValidator.validate(
        `${this.path}.pickupRequested`,
        booking?.pickupRequested
      ),
      StringValidator.validate(
        `${this.path}.pickupPointId`,
        booking?.pickupPointId,
        { nullable: true }
      ),
      StringValidator.validate(
        `${this.path}.pickupHotel`,
        booking?.pickupHotel,
        { nullable: true }
      ),
      StringValidator.validate(
        `${this.path}.pickupHotelRoom`,
        booking?.pickupHotelRoom,
        { nullable: true }
      ),
      ...this.validatePickupPoint(booking),
    ].flatMap((v) => (v ? [v] : []));
  };

  private validatePickupPoint = (booking: Booking | null): ValidatorError[] => {
    if (booking?.pickupPoint) {
      return [
        StringValidator.validate(
          `${this.path}.booking.pickupPoint.id`,
          booking?.pickupPoint?.id
        ),
        StringValidator.validate(
          `${this.path}.booking.pickupPoint.name`,
          booking?.pickupPoint?.name
        ),
        StringValidator.validate(
          `${this.path}.booking.pickupPoint.directions`,
          booking?.pickupPoint?.directions,
          { nullable: true }
        ),
        StringValidator.validate(
          `${this.path}.booking.pickupPoint.address`,
          booking?.pickupPoint?.address
        ),
        NumberValidator.validate(
          `${this.path}.booking.pickupPoint.latitude`,
          booking?.pickupPoint?.latitude,
          { nullable: true }
        ),
        NumberValidator.validate(
          `${this.path}.booking.pickupPoint.longitude`,
          booking?.pickupPoint?.longitude,
          { nullable: true }
        ),
        // CommonValidator.validateLocalDateTime(
        //   `${this.path}.booking.pickupPoint.localDateTime`,
        //   booking.pickupPoint.localDateTime
        // ),
        StringValidator.validate(
          `${this.path}.booking.pickupPoint.googlePlaceId`,
          booking?.pickupPoint?.googlePlaceId,
          { nullable: true }
        ),
        StringValidator.validate(
          `${this.path}.booking.pickupPoint.street`,
          booking?.pickupPoint?.street,
          { nullable: true }
        ),
        StringValidator.validate(
          `${this.path}.booking.pickupPoint.postalCode`,
          booking?.pickupPoint?.postalCode,
          { nullable: true }
        ),
        StringValidator.validate(
          `${this.path}.booking.pickupPoint.locality`,
          booking?.pickupPoint?.locality,
          { nullable: true }
        ),
        StringValidator.validate(
          `${this.path}.booking.pickupPoint.region`,
          booking?.pickupPoint?.region,
          { nullable: true }
        ),
        StringValidator.validate(
          `${this.path}.booking.pickupPoint.state`,
          booking?.pickupPoint?.state,
          { nullable: true }
        ),
        StringValidator.validate(
          `${this.path}.booking.pickupPoint.country`,
          booking?.pickupPoint?.country,
          { nullable: true }
        ),
      ].flatMap((v) => (v ? [v] : []));
    }
    return [];
  };
}
