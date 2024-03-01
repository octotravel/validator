import { CapabilityId } from '@octocloud/types';
import { Step } from '../step/Step';
import { DoublyLinkedList } from 'linked-list-typed';
import { ScenarioId } from '../types/ScenarioId';

export interface Scenario {
  getId(): ScenarioId;
  getName(): string;
  getDescription(): string;
  getRequiredCapabilities(): CapabilityId[];
  getOptionalCapabilities(): CapabilityId[];
  getCapabilities(): CapabilityId[];
  getSteps(): DoublyLinkedList<Step>;
}
