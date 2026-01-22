import docs from '../../consts/docs';
import { Context } from '../../context/Context';
import { GetProductsScenario } from '../../Scenarios/Product/GetProducts';
import { Scenario } from '../../Scenarios/Scenario';
import { BaseFlow } from '../BaseFlow';
import { Flow, FlowResult } from '../Flow';

export class ProductsFlow extends BaseFlow implements Flow {
  public constructor() {
    super('Get Products', docs.products);
  }

  public validate = async (context: Context): Promise<FlowResult> => {
    const scenarios: Scenario[] = [
      new GetProductsScenario()
    ];
    return await this.validateScenarios(scenarios, context);
  };
}
