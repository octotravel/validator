import descriptions from '../../consts/descriptions';
import { Context } from '../../context/Context';
import { SupplierScenarioHelper } from '../../helpers/SupplierScenarioHelper';
import { Scenario, ScenarioResult } from '../Scenario';

export class GetSupplierScenario implements Scenario {
  private readonly supplierScenarioHelper = new SupplierScenarioHelper();

  public validate = async (context: Context): Promise<ScenarioResult> => {
    const apiClient = context.getApiClient();

    const result = await apiClient.getSupplier(context);
    const name = 'Get Supplier';
    const description = descriptions.getSupplier;

    return this.supplierScenarioHelper.validateSupplier(
      {
        result,
        name,
        description,
      },
      context,
    );
  };
}
