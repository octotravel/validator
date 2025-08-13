import { CapabilityId } from '@octocloud/types';
import { DoublyLinkedList } from 'linked-list-typed';
import { Step } from '../step/Step';
import { ScenarioId } from './ScenarioId';

export interface Scenario {
  getId(): ScenarioId;
  getName(): string;
  getDescription(): string;
  getRequiredCapabilities(): CapabilityId[];
  getOptionalCapabilities(): CapabilityId[];
  getCapabilities(): CapabilityId[];
  getSteps(): DoublyLinkedList<Step>;
}
