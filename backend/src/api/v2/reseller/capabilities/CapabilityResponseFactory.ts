import { CapabilityId } from '@octocloud/types';
import { $enum } from 'ts-enum-util';
import { CapabilitiesResponse } from './CapabilitiesResponse';

export class CapabilityResponseFactory {
  public static create(capabilities: CapabilityId[]): CapabilitiesResponse {
    return capabilities.map((capability) => {
      return {
        id: $enum(CapabilityId).getKeyOrThrow(capability.toString()),
        name: capability,
        description: '',
      };
    });
  }
}
