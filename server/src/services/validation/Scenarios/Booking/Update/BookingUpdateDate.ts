import { ErrorType, ValidatorError } from './../../../../../validators/backendValidator/ValidatorHelpers';
import { Scenario } from "../../Scenario";
import { BookingUpdateScenarioHelper } from "../../../helpers/BookingUpdateScenarioHelper";
import { Config } from "../../../config/Config";
import descriptions from "../../../consts/descriptions";
import { ScenarioHelper } from "../../../helpers/ScenarioHelper";
import { Booker } from "../../../Booker";

export class BookingUpdateDateScenario implements Scenario {
  private helper = new ScenarioHelper()
  private booker = new Booker();
  private config = Config.getInstance();
  private apiClient = this.config.getApiClient();

  private bookingUpdateScenarioHelper = new BookingUpdateScenarioHelper();

  public validate = async () => {
    const name = `Booking Update - Change Date`;
    const description = descriptions.bookingUpdateDate;
    const [bookableProduct] = this.config.productConfig.availableProducts;

    const resultReservation = await this.booker.createReservation(
      bookableProduct
    );

    if (resultReservation.data === null) {
      return this.helper.handleResult({
        result: resultReservation,
        name,
        description,
        errors: [new ValidatorError({type: ErrorType.CRITICAL, message: 'Reservation Creation Failed'})],
      })
    }

    const result = await this.apiClient.bookingUpdate({
      uuid: resultReservation.data.uuid,
      availabilityId: bookableProduct.getAvialabilityID({
        omitID: resultReservation.data.availabilityId,
      }),
    });

    return this.bookingUpdateScenarioHelper.validateBookingUpdate(
      {
        result,
        name,
        description,
      },
      resultReservation.data
    );
  };
}
