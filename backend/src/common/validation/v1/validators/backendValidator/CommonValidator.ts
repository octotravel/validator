import { AvailabilityType, OpeningHours } from '@octocloud/types';
import { ArrayValidator, RegExpValidator, ValidatorError } from './ValidatorHelpers';

interface CommonValidatorParams {
  nullable?: boolean;
}

export class CommonValidator {
  public static validateOpeningHours = (
    label: string,
    openingHours: OpeningHours[],
    availabilityType?: AvailabilityType,
  ): ValidatorError[] => {
    const regExp = /^\d{2}:\d{2}$/g;
    const errors: Array<ValidatorError | null> = [
      ...openingHours
        .map((openingHour, i) => [
          RegExpValidator.validate(`${label}.openingHours[${i}].from`, openingHour?.from, regExp),
          RegExpValidator.validate(`${label}.openingHours[${i}].to`, openingHour?.to, regExp),
        ])
        .flat(),
    ];
    if (availabilityType === AvailabilityType.OPENING_HOURS) {
      errors.push(
        ArrayValidator.validate(`${label}.openingHours`, openingHours, {
          min: 1,
        }),
      );
    }

    return errors.flatMap((v) => (v ? [v] : []));
  };

  public static validateLocalDate = (label: string, localDateTime: string): ValidatorError | null => {
    const regExp = /^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/;
    return RegExpValidator.validate(label, localDateTime, regExp);
  };

  public static validateLocalDateTime = (label: string, localDateTime?: string): ValidatorError | null => {
    const regExp =
      /^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])T([01][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])([+-](?:2[0-3]|[01][0-9]):[0-5][0-9])$/;
    return RegExpValidator.validate(label, localDateTime, regExp);
  };

  public static validateUTCDateTime = (
    label: string,
    utcDate?: string | null,
    params?: CommonValidatorParams,
  ): ValidatorError | null => {
    const regExp = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])T([01]\d|2[0-3]):[0-5]\d:[0-5]\d(\.\d{3})?Z$/;
    if (params?.nullable) {
      if (utcDate !== null) {
        return RegExpValidator.validate(label, utcDate, regExp);
      }
    } else {
      return RegExpValidator.validate(label, utcDate, regExp);
    }
    return null;
  };
}
