import { Scenario } from "../../Scenario";
import { BookingExtendScenarioHelper } from "../../../helpers/BookingExtendScenarioHelper";
import { Config } from "../../../config/Config";
import descriptions from "../../../consts/descriptions";
import { Booker } from "../../../Booker";
import { ScenarioHelper } from "../../../helpers/ScenarioHelper";
import { ErrorType, ValidatorError } from "../../../../../validators/backendValidator/ValidatorHelpers";

export class BookingReservationExtendScenario implements Scenario {
  private booker = new Booker();
  private helper = new ScenarioHelper()
  private config = Config.getInstance();
  private apiClient = this.config.getApiClient();
  private bookingExtendScenarioHelper = new BookingExtendScenarioHelper();

  public validate = async () => {
    const name = `Extend Reservation`;
    const description = descriptions.bookingReservationExtend;
    const [bookableProduct] = this.config.productConfig.availableProducts;
    const resultReservation = await this.booker.createReservation(bookableProduct);
    if (resultReservation.data === null) {
      return this.helper.handleResult({
        result: resultReservation,
        name,
        description,
        errors: [new ValidatorError({type: ErrorType.CRITICAL, message: 'Reservation Creation Failed'})],
      })
    }
    const result = await this.apiClient.bookingExtend({
      uuid: resultReservation.data.uuid,
      expirationMinutes: 31,
    });

    return this.bookingExtendScenarioHelper.validateBookingExtend(
      {
        result,
        name,
        description,
      },
      {
        capabilities: this.config.getCapabilityIDs(),
      },
      resultReservation.data
    );
  };
}
