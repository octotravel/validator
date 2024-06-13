import { CapabilityId } from '@octocloud/types';

export class CapabilitiesParser {
  public static parseCapabilities(capabilities: string): CapabilityId[] {
    return capabilities.split(',').filter((c) => c !== '') as CapabilityId[];
  }
}
