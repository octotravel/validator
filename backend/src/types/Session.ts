import { CapabilityId } from '@octocloud/types';

export interface Session {
  id: string;
  name: string;
  capabilities: CapabilityId[];
  created_at: Date;
  updated_at: Date;
  current_scenario: string;
  current_step: string;
}

export interface SessionRowData {
  id: string;
  name: string;
  created_at: Date;
  updated_at: Date;
  capabilities: CapabilityId[];
}

export interface GetSessionRowData {
  id: string;
  name: string;
  capabilities: string[];
}
