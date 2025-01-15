import { GetCapabilitiesScenario } from '../../Scenarios/Capabilities/GetCapabilities';
import { Context } from '../../context/Context';
import { BaseFlow } from '../BaseFlow';
import { Flow, FlowResult } from '../Flow';

export class CapabilitiesFlow extends BaseFlow implements Flow {
  public constructor() {
    super('Get Capabilities', '');
  }

  public validate = async (context: Context): Promise<FlowResult> => {
    const scenario = new GetCapabilitiesScenario();
    return await this.validateScenarios([scenario], context);
  };
}
