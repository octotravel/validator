import { CapabilityId } from '@octocloud/types';
import { Scenario } from '../../../../common/validation/v2/scenario/Scenario';

export class ScenarioResponse {
  public constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
    public readonly requiredCapabilities: CapabilityId[],
    public readonly optionalCapabilities: CapabilityId[],
  ) {}

  public static create(scenario: Scenario): ScenarioResponse {
    return new this(
      scenario.getId(),
      scenario.getName(),
      scenario.getDescription(),
      scenario.getRequiredCapabilities(),
      scenario.getOptionalCapabilities(),
    );
  }
}
