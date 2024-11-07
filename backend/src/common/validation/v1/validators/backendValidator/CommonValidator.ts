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
          RegExpValidator.validate(`${label}.openingHours[${i}].from`, openingHour?.from, regExp, {
            shouldWarn: true,
          }),
          RegExpValidator.validate(`${label}.openingHours[${i}].to`, openingHour?.to, regExp, {
            shouldWarn: true,
          }),
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
    return RegExpValidator.validate(label, localDateTime, regExp, {
      shouldWarn: true,
    });
  };

  public static validateLocalDateTime = (label: string, localDateTime?: string): ValidatorError | null => {
    const regExp =
      /^(?:[1-9]\d{3}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1\d|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[1-9]\d(?:0[48]|[2468][048]|[13579][26])|(?:[2468][048]|[13579][26])00)-02-29)T(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d(?:\.\d{1,9})?(?:Z|[+-][01]\d:[0-5]\d)$/;
    return RegExpValidator.validate(label, localDateTime, regExp, {
      shouldWarn: true,
    });
  };

  public static validateUTCDateTime = (
    label: string,
    utcDate?: string | null,
    params?: CommonValidatorParams,
  ): ValidatorError | null => {
    const regExp = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])T([01]\d|2[0-3]):[0-5]\d:[0-5]\d(\.\d{3})?Z$/;
    if (params?.nullable) {
      if (utcDate !== null) {
        return RegExpValidator.validate(label, utcDate, regExp, {
          shouldWarn: true,
        });
      }
    } else {
      return RegExpValidator.validate(label, utcDate, regExp, {
        shouldWarn: true,
      });
    }
    return null;
  };

  public static validateUTCDate = (label: string, utcDate: string): ValidatorError | null => {
    const regExp = /^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])T([01][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])Z$/;
    return RegExpValidator.validate(label, utcDate, regExp, {
      shouldWarn: true,
    });
  };

  public static validateUuid = (
    label: string,
    uuid?: string | null,
    params?: CommonValidatorParams,
  ): ValidatorError | null => {
    const regExp = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/;
    if (params?.nullable) {
      if (uuid !== null) {
        return RegExpValidator.validate(label, uuid, regExp, {
          ...params,
          shouldWarn: false,
        });
      }
    } else {
      return RegExpValidator.validate(label, uuid, regExp, {
        ...params,
        shouldWarn: false,
      });
    }
    return null;
  };
}
