import { format, formatInTimeZone } from 'date-fns-tz';

export abstract class DateHelper {
  public static availabilityIdFormat = (date: Date, timeZone: string): string => {
    return format(date, "yyyy-MM-dd'T'HH:mm:ssxxx", {
      timeZone,
    });
  };

  public static availabilityDateFormat = (date: Date): string => {
    return format(date, 'yyyy-MM-dd');
  };

  public static utcDateFormat = (date: Date): string => {
    return `${date.toISOString().split('.')[0]}Z`;
  };

  public static getTime(dateTime: string): string {
    return dateTime.split('T')[1].slice(0, 5);
  }

  public static getDate(dateTime: string): string {
    return dateTime.split('T')[0];
  }

  public static localDate(date: Date, timeZone: string | undefined, offsetDays = 0): string {
    const zone = DateHelper.isValidTimeZone(timeZone) ? timeZone : 'UTC';
    const [year, month, day] = formatInTimeZone(date, zone, 'yyyy-MM-dd').split('-').map(Number);

    return DateHelper.getDate(new Date(Date.UTC(year, month - 1, day + offsetDays)).toISOString());
  }

  private static isValidTimeZone(timeZone: unknown): timeZone is string {
    if (typeof timeZone !== 'string' || timeZone === '') {
      return false;
    }

    try {
      new Intl.DateTimeFormat('en-US', { timeZone });
      return true;
    } catch {
      return false;
    }
  }
}
