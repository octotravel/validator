import { Scenario } from '../../Scenarios/Scenario';
import { GetSupplierScenario } from '../../Scenarios/Supplier/GetSuppliers';
import docs from '../../consts/docs';
import { Context } from '../../context/Context';
import { BaseFlow } from '../BaseFlow';
import { Flow, FlowResult } from '../Flow';

export class SupplierFlow extends BaseFlow implements Flow {
  public constructor() {
    super('Get Suppliers', docs.supplier);
  }

  public validate = async (context: Context): Promise<FlowResult> => {
    const scenarios: Scenario[] = [new GetSupplierScenario()];
    return await this.validateScenarios(scenarios, context);
  };
}
