import { Availability, AvailabilityType, Product } from '@octocloud/types';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiClient } from '../../api/ApiClient';
import { Context } from '../../context/Context';
import { AvailabilityCheckBadRequestScenario } from '../Availability/AvailabilityCheckBadRequest';
import { AvailabilityChecIntervalScenario } from '../Availability/AvailabilityCheckInterval';
import { AvailabilityCheckInvalidOptionScenario } from '../Availability/AvailabilityCheckInvalidOption';
import { AvailabilityCheckInvalidProductScenario } from '../Availability/AvailabilityCheckInvalidProduct';
import { AvailabilityCheckStatusScenario } from '../Availability/AvailabilityCheckStatus';
import { AvailabilityCalendarBadRequestScenario } from '../AvailabilityCalendar/AvailabilityCalendarBadRequest';
import { AvailabilityCalendarIntervalScenario } from '../AvailabilityCalendar/AvailabilityCalendarInterval';
import { AvailabilityCalendarInvalidOptionScenario } from '../AvailabilityCalendar/AvailabilityCalendarInvalidOption';
import { AvailabilityCalendarInvalidProductScenario } from '../AvailabilityCalendar/AvailabilityCalendarInvalidProduct';
import { Scenario } from '../Scenario';

const product = {
  id: 'product',
  timeZone: 'Australia/Sydney',
  availabilityType: AvailabilityType.START_TIME,
  options: [{ id: 'option', default: true }],
} as Product;

const emptyResult = { request: null, response: null, data: null };

const availabilityCheckScenarios: Array<[string, Scenario]> = [
  ['interval', new AvailabilityChecIntervalScenario(product)],
  ['status', new AvailabilityCheckStatusScenario([product])],
  ['bad request', new AvailabilityCheckBadRequestScenario()],
  ['invalid option', new AvailabilityCheckInvalidOptionScenario()],
  ['invalid product', new AvailabilityCheckInvalidProductScenario()],
];

const availabilityCalendarScenarios: Array<[string, Scenario]> = [
  ['interval', new AvailabilityCalendarIntervalScenario(product)],
  ['invalid option', new AvailabilityCalendarInvalidOptionScenario()],
  ['invalid product', new AvailabilityCalendarInvalidProductScenario()],
];

describe('availability scenario dates', () => {
  let context: Context;
  let apiClient: ApiClient;

  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-11-11T22:00:00Z'));

    context = new Context();
    context.setProducts([product]);
    context.productConfig.addAvailability = {
      availabilityType: product.availabilityType,
      availability: { id: 'availability' } as Availability,
    };

    apiClient = new ApiClient({ url: 'https://supplier.test', headers: {} });
    vi.spyOn(apiClient, 'getAvailability').mockResolvedValue(emptyResult);
    vi.spyOn(apiClient, 'getAvailabilityCalendar').mockResolvedValue(emptyResult);
    vi.spyOn(context, 'getApiClient').mockReturnValue(apiClient);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it.each(availabilityCheckScenarios)(
    'availability check %s asks for today in the product time zone',
    async (_name, scenario) => {
      await scenario.validate(context);

      expect(apiClient.getAvailability).toHaveBeenCalledWith(
        expect.objectContaining({ localDateStart: '2026-11-12', localDateEnd: '2026-12-12' }),
        context,
      );
    },
  );

  it.each(availabilityCalendarScenarios)(
    'availability calendar %s asks for today in the product time zone',
    async (_name, scenario) => {
      await scenario.validate(context);

      expect(apiClient.getAvailabilityCalendar).toHaveBeenCalledWith(
        expect.objectContaining({ localDateStart: '2026-11-12', localDateEnd: '2026-12-12' }),
        context,
      );
    },
  );

  it('availability calendar bad request ends 30 days after today in the product time zone', async () => {
    await new AvailabilityCalendarBadRequestScenario().validate(context);

    expect(apiClient.getAvailabilityCalendar).toHaveBeenCalledWith(
      expect.objectContaining({ localDateEnd: '2026-12-12' }),
      context,
    );
  });

  it('availability check status asks each product for today in its own time zone', async () => {
    const productBehindUtc = { ...product, id: 'product-behind-utc', timeZone: 'America/Los_Angeles' };

    await new AvailabilityCheckStatusScenario([product, productBehindUtc]).validate(context);

    expect(apiClient.getAvailability).toHaveBeenCalledWith(
      expect.objectContaining({ productId: 'product', localDateStart: '2026-11-12', localDateEnd: '2026-12-12' }),
      context,
    );
    expect(apiClient.getAvailability).toHaveBeenCalledWith(
      expect.objectContaining({
        productId: 'product-behind-utc',
        localDateStart: '2026-11-11',
        localDateEnd: '2026-12-11',
      }),
      context,
    );
  });
});
