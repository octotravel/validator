import { DeliveryFormat } from '@octocloud/types';

// Temporary fix: PNG_URL, GOOGLE_WALLET_URL and HTML_URL are missing from @octocloud/types; drop them once ventrata/octo-typespec#116 is released and the types are bumped.
export const DELIVERY_FORMATS: string[] = [
  ...Object.values(DeliveryFormat),
  'PNG_URL',
  'GOOGLE_WALLET_URL',
  'HTML_URL',
];
