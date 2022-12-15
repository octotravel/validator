import { ErrorType, ValidatorError } from './../../../../../validators/backendValidator/ValidatorHelpers.ts';
import { Scenario } from "../../Scenario.ts";
import { BookingUpdateScenarioHelper } from "../../../helpers/BookingUpdateScenarioHelper.ts";
import { Config } from "../../../config/Config.ts";
import descriptions from "../../../consts/descriptions.ts";
import { ScenarioHelper } from "../../../helpers/ScenarioHelper.ts";
import { Booker } from "../../../Booker.ts";

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
