import { AvailabilityType, Booking, Product } from '@octocloud/types';
import { describe, expect, it } from 'vitest';
import { Result } from '../../api/types';
import { Context } from '../../context/Context';
import { ScenarioResult } from '../../Scenarios/Scenario';
import { AvailabilityCalendarScenarioHelper } from '../AvailabilityCalendarScenarioHelper';
import { AvailabilityScenarioHelper } from '../AvailabilityScenarioHelper';
import { BookingCancellationScenarioHelper } from '../BookingCancellationScenarioHelper';
import { BookingConfirmationScenarioHelper } from '../BookingConfirmationScenarioHelper';
import { BookingExtendScenarioHelper } from '../BookingExtendScenarioHelper';
import { BookingGetScenarioHelper } from '../BookingGetScenarioHelper';
import { BookingListScenarioHelper } from '../BookingListScenarioHelper';
import { BookingUpdateScenarioHelper } from '../BookingUpdateScenarioHelper';
import { CapabilitiesScenarioHelper } from '../CapabilitiesScenarioHelper';
import { ProductScenarioHelper } from '../ProductScenarioHelper';
import { SupplierScenarioHelper } from '../SupplierScenarioHelper';

const STATUS_MESSAGE = /^response\.status has to be equal to 200/;

// biome-ignore lint/suspicious/noExplicitAny: <?>
const buildResult = (status: number, data: any): Result<any> => ({
  request: { url: 'https://supplier.test', method: 'POST', body: {}, headers: {} },
  response: {
    status,
    body: JSON.stringify(data),
    headers: {},
    error: status >= 200 && status < 300 ? null : { status, body: JSON.stringify(data) },
  },
  data,
});

const booking = { uuid: 'u', productId: 'p', optionId: 'o', availabilityId: 'a', unitItems: [] } as unknown as Booking;
const product = { availabilityType: AvailabilityType.START_TIME } as Product;
const errorBody = { error: 'INTERNAL_SERVER_ERROR', errorMessage: 'boom' };
const scenario = { name: 'n', description: 'd' };

// biome-ignore lint/suspicious/noExplicitAny: <?>
const helpers: Array<{ name: string; okBody: any; run: (result: Result<any>) => ScenarioResult }> = [
  {
    name: 'Supplier',
    okBody: {},
    run: (result) => new SupplierScenarioHelper().validateSupplier({ ...scenario, result }, new Context()),
  },
  {
    name: 'Capabilities',
    okBody: [],
    run: (result) => new CapabilitiesScenarioHelper().validateCapabilities({ ...scenario, result }),
  },
  {
    name: 'Products',
    okBody: [],
    run: (result) => new ProductScenarioHelper().validateProducts({ ...scenario, result }, new Context()),
  },
  {
    name: 'Product',
    okBody: {},
    run: (result) => new ProductScenarioHelper().validateProduct({ ...scenario, result }, new Context()),
  },
  {
    name: 'Availability',
    okBody: [],
    run: (result) =>
      new AvailabilityScenarioHelper().validateAvailability({ ...scenario, result }, product, new Context()),
  },
  {
    name: 'AvailabilityCalendar',
    okBody: [],
    run: (result) =>
      new AvailabilityCalendarScenarioHelper().validateAvailability({ ...scenario, result }, product, new Context()),
  },
  {
    name: 'BookingConfirmation',
    okBody: { unitItems: [] },
    run: (result) =>
      new BookingConfirmationScenarioHelper().validateBookingConfirmation(
        { ...scenario, result },
        booking,
        new Context(),
      ),
  },
  {
    name: 'BookingCancellation',
    okBody: { unitItems: [] },
    run: (result) =>
      new BookingCancellationScenarioHelper().validateBookingCancellation(
        { ...scenario, result },
        booking,
        new Context(),
      ),
  },
  {
    name: 'BookingExtend',
    okBody: { unitItems: [] },
    run: (result) =>
      new BookingExtendScenarioHelper().validateBookingExtend({ ...scenario, result }, booking, new Context()),
  },
  {
    name: 'BookingGet',
    okBody: { unitItems: [] },
    run: (result) => new BookingGetScenarioHelper().validateBookingGet({ ...scenario, result }, new Context()),
  },
  {
    name: 'BookingList',
    okBody: [],
    run: (result) => new BookingListScenarioHelper().validateBookingList({ ...scenario, result }, new Context()),
  },
  {
    name: 'BookingUpdate',
    okBody: { unitItems: [] },
    run: (result) =>
      new BookingUpdateScenarioHelper().validateBookingUpdate({ ...scenario, result }, booking, new Context()),
  },
];

describe.each(helpers)('$name scenario helper status validation', ({ okBody, run }) => {
  it('should report a critical status error and still validate the body for 201', () => {
    const result = run(buildResult(201, okBody));
    expect(result.errors.filter((e) => STATUS_MESSAGE.test(e.message))).toHaveLength(1);
    expect(result.success).toBe(false);
  });

  it('should report only the status error for 500', () => {
    const result = run(buildResult(500, errorBody));
    expect(result.errors.map((e) => e.message)).toEqual([
      'response.status has to be equal to 200, but the provided value was: 500',
    ]);
    expect(result.success).toBe(false);
  });

  it('should not report a status error for 200', () => {
    const result = run(buildResult(200, okBody));
    expect(result.errors.some((e) => STATUS_MESSAGE.test(e.message))).toBe(false);
  });
});
