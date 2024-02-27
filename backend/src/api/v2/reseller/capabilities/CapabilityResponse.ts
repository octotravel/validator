import { CapabilityId } from '@octocloud/types';
import { $enum } from 'ts-enum-util';

export class CapabilityResponse {
  private constructor(
    public readonly name: string,
    public readonly id: string,
    public readonly description: string,
  ) {}

  public static create(capability: CapabilityId): CapabilityResponse {
    return new this($enum(CapabilityId).getKeyOrThrow(capability.toString()), capability, '');
  }
}
