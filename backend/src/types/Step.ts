import { CapabilityId } from '@octocloud/types';
import { Endpoint } from './Endpoint';

export interface Step {
  name: string;
  endpoint: Endpoint;
}
