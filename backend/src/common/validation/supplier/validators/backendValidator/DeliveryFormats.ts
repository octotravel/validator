import { DeliveryFormat } from '@octocloud/types';

// Temporary fix
export const DELIVERY_FORMATS: string[] = [
  ...Object.values(DeliveryFormat),
  'PNG_URL',
  'GOOGLE_WALLET_URL',
  'HTML_URL',
];
