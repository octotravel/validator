import { DeliveryFormat } from '@octocloud/types';

export const DELIVERY_FORMATS: string[] = [...Object.values(DeliveryFormat), 'PNG_URL', 'GOOGLE_WALLET_URL'];
