import { CapabilityResponse } from './CapabilityResponse';

export class CapabilitiesResponse {
  public constructor(public readonly items: CapabilityResponse[]) {}
}
