import { CapabilityId, DeliveryFormat, DeliveryMethod, Product, RedemptionMethod } from '@octocloud/types';
import { describe, expect, it } from 'vitest';
import { DELIVERY_FORMATS } from '../DeliveryFormats';
import { ProductValidator } from '../Product/ProductValidator';
import { TicketValidator } from '../Ticket/TicketValidator';

const deliveryFormatErrors = (deliveryFormats: string[]): string[] => {
  const validator = new ProductValidator({ capabilities: [] as CapabilityId[] });
  const product = { deliveryFormats, deliveryMethods: [DeliveryMethod.TICKET] } as unknown as Product;
  return validator
    .validate(product)
    .map((e) => e.message)
    .filter((m) => m.includes('deliveryFormats'));
};

describe('DELIVERY_FORMATS', () => {
  it('includes every DeliveryFormat from @octocloud/types', () => {
    expect(DELIVERY_FORMATS).toEqual(expect.arrayContaining(Object.values(DeliveryFormat)));
  });

  it('includes PNG_URL and GOOGLE_WALLET_URL', () => {
    expect(DELIVERY_FORMATS).toEqual(expect.arrayContaining(['PNG_URL', 'GOOGLE_WALLET_URL']));
  });
});

describe('ProductValidator deliveryFormats', () => {
  it('accepts PNG_URL and GOOGLE_WALLET_URL alongside standard formats', () => {
    expect(deliveryFormatErrors(['QRCODE', 'PNG_URL', 'PKPASS_URL', 'GOOGLE_WALLET_URL', 'PDF_URL'])).toEqual([]);
  });

  it('still rejects unknown formats', () => {
    expect(deliveryFormatErrors(['QRCODE', 'RANDOM'])).toHaveLength(1);
  });
});

describe('TicketValidator deliveryFormat', () => {
  it('accepts PNG_URL and GOOGLE_WALLET_URL', () => {
    const validator = new TicketValidator({ path: 'ticket' });
    const ticket = {
      redemptionMethod: RedemptionMethod.DIGITAL,
      utcRedeemedAt: null,
      deliveryOptions: [
        { deliveryFormat: 'PNG_URL', deliveryValue: 'https://example.com/a.png' },
        { deliveryFormat: 'GOOGLE_WALLET_URL', deliveryValue: 'https://example.com/wallet' },
      ],
    };
    const errors = validator.validate(ticket as never).filter((e) => e.message.includes('deliveryFormat'));
    expect(errors).toEqual([]);
  });
});
