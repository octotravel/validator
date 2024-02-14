import { CapabilityId } from '@octocloud/types';
import { Step } from './Step';

export interface Scenario {
  id: string;
  name: string;
  required_capabilities: CapabilityId[];
  optional_capabilities: CapabilityId[];
  steps: Step[];
}
