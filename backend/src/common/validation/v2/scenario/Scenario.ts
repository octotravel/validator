import { CapabilityId } from '@octocloud/types';
import { Step } from '../step/Step';
import { DoublyLinkedList } from 'linked-list-typed';

export interface Scenario {
  getId(): string;
  getName(): string;
  getDescription(): string;
  getRequiredCapabilities(): CapabilityId[];
  getOptionalCapabilities(): CapabilityId[];
  getCapabilities(): CapabilityId[];
  getSteps(): DoublyLinkedList<Step>;
}
