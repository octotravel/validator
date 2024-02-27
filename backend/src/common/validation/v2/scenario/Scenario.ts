import { CapabilityId } from '@octocloud/types';
import { Step } from '../step/Step';

export interface Scenario {
  getId(): string;
  getName(): string;
  getDescription(): string;
  getRequiredCapabilities(): CapabilityId[];
  getOptionalCapabilities(): CapabilityId[];
  getCapabilities(): CapabilityId[];
  getSteps(): Step[];
}
