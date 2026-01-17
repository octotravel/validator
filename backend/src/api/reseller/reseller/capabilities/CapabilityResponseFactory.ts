import { CapabilityId } from '@octocloud/types';
import { $enum } from 'ts-enum-util';
import { CapabilitiesResponse } from './CapabilitiesResponse';

export class CapabilityResponseFactory {
  public static create(docsUrl: string, capabilities: CapabilityId[]): CapabilitiesResponse {
    return {
      docsUrl: docsUrl,
      capabilities: capabilities.map((capability) => {
        return {
          id: capability,
          name: $enum(CapabilityId).getKeyOrThrow(capability.toString()),
          description: '',
        };
      }),
    };
  }
}
